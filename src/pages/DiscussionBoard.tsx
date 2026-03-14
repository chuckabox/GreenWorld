import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
import {
  MessageCircle,
  Send,
  Heart,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Users,
  Hash,
  Calendar,
  X,
  Paperclip,
  Mic,
} from "lucide-react";
import { UserData, StoredUser } from "../types";
import { cn } from "../lib/utils";
import demoAccounts from "../data/demoAccounts.json";
import tasksAndEventsData from "../data/tasksAndEvents.json";

const FRIENDS_STORAGE_KEY = "community_friends";

const TOPICS = ["General", "Beach clean-up", "Tips & tricks", "Events", "Waste & recycling", "Networking"];

const BASE_CHANNELS = [
  { id: "general", name: "General", icon: Hash },
  { id: "events", name: "Events", icon: Calendar },
];

const HARDCODED_POSTS = [
  {
    id: "1",
    channelId: "general",
    author: "Sarah M.",
    avatarSeed: "sarah",
    time: "2 hours ago",
    topic: "Beach clean-up",
    body: "Who's joining the South Bank clean-up this Saturday? We're meeting at 9 am near the ferry terminal. Bring gloves and a reusable bag – I'll bring extra if anyone needs.",
    likes: 12,
    initialReplyCount: 5,
  },
  {
    id: "2",
    channelId: "general",
    author: "James K.",
    avatarSeed: "james",
    time: "5 hours ago",
    topic: "Tips & tricks",
    body: "Switched to a bike for my daily commute last month. Already saved ~40 kg CO₂ and feeling fitter. If you're in Brisbane, the BCC bike paths make it really easy. Happy to share routes if anyone's interested!",
    likes: 28,
    initialReplyCount: 8,
  },
  {
    id: "3",
    channelId: "events",
    author: "Elena T.",
    avatarSeed: "elena",
    time: "Yesterday",
    topic: "Events",
    body: "Big shout-out to everyone who came to the tree-planting event at Roma Street Parklands. We planted over 200 native seedlings. The council team said we were one of the biggest volunteer turnouts they've had. 🌱",
    likes: 45,
    initialReplyCount: 11,
  },
  {
    id: "4",
    channelId: "general",
    author: "Alex R.",
    avatarSeed: "alex",
    time: "2 days ago",
    topic: "Waste & recycling",
    body: "Finally got my building to add proper recycling bins in the common area. Took a bit of back-and-forth with strata but so worth it. If anyone's in an apartment and wants to do the same, I can share the email template I used.",
    likes: 19,
    initialReplyCount: 4,
  },
  {
    id: "5",
    channelId: "general",
    author: "Maya L.",
    avatarSeed: "maya",
    time: "3 days ago",
    topic: "Networking",
    body: "Looking for study buddies for the Green Hub modules – especially the circular economy one. I'm based near UQ and free most evenings. Drop a message if you want to form a small group.",
    likes: 7,
    initialReplyCount: 6,
  },
];

type Post = (typeof HARDCODED_POSTS)[number] & { initialReplyCount: number; channelId: string };
type UserPost = {
  id: string;
  channelId: string;
  author: string;
  avatarSeed: string;
  time: string;
  topic: string;
  body: string;
  likes: number;
  initialReplyCount: number;
};
type Reply = { author: string; body: string; time: string };
type Friend = { id: number; name: string };
type Channel = { id: string; name: string; icon?: React.ComponentType<{ size?: number }> };
type DirectMessage = { id: string; fromUserId: number; body: string; time: string };

function loadFriends(userId: number): Friend[] {
  try {
    const raw = localStorage.getItem(`${FRIENDS_STORAGE_KEY}_${userId}`);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveFriends(userId: number, friends: Friend[]) {
  localStorage.setItem(`${FRIENDS_STORAGE_KEY}_${userId}`, JSON.stringify(friends));
}

export const DiscussionBoard = ({ user }: { user: UserData }) => {
  const [friends, setFriends] = useState<Friend[]>(() => loadFriends(user.id));
  const [addFriendOpen, setAddFriendOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteActivityId, setInviteActivityId] = useState("");
  const [inviteFriendIds, setInviteFriendIds] = useState<Set<number>>(new Set());
  const [inviteSent, setInviteSent] = useState(false);

  const [channels, setChannels] = useState<Channel[]>(() => {
    try {
      const raw = localStorage.getItem(`community_channels_${user.id}`);
      const extra: Channel[] = raw ? JSON.parse(raw) : [];
      return [...BASE_CHANNELS, ...extra];
    } catch {
      return BASE_CHANNELS;
    }
  });
  const [createChannelOpen, setCreateChannelOpen] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const [viewMode, setViewMode] = useState<"channel" | "dm">("channel");
  const [selectedChannel, setSelectedChannel] = useState("general");
  const [activeFriendId, setActiveFriendId] = useState<number | null>(null);
  const [newPostBody, setNewPostBody] = useState("");
  const [newPostTopic, setNewPostTopic] = useState(TOPICS[0]);
  const [userPosts, setUserPosts] = useState<UserPost[]>([]);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [repliesByPostId, setRepliesByPostId] = useState<Record<string, Reply[]>>({});
  const [replyContext, setReplyContext] = useState<string | null>(null);
  const [dmMessages, setDmMessages] = useState<Record<number, DirectMessage[]>>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const messageInputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    saveFriends(user.id, friends);
  }, [user.id, friends]);

  useEffect(() => {
    const extra = channels.filter((c) => !BASE_CHANNELS.some((b) => b.id === c.id));
    localStorage.setItem(`community_channels_${user.id}`, JSON.stringify(extra));
  }, [channels, user.id]);

  const allUsers = useMemo(() => {
    const stored: StoredUser[] = JSON.parse(localStorage.getItem("users") || "[]");
    const demo = demoAccounts as StoredUser[];
    const byId = new Map<number, StoredUser>();
    [...demo, ...stored].forEach((u) => byId.set(u.id, u));
    return Array.from(byId.values()).filter((u) => u.id !== user.id && u.role !== "admin");
  }, [user.id]);

  const addableUsers = useMemo(() => {
    const friendIds = new Set(friends.map((f) => f.id));
    return allUsers.filter((u) => !friendIds.has(u.id));
  }, [allUsers, friends]);

  const activities = useMemo(() => {
    const list = tasksAndEventsData as { id: string; type: string; title: string; date?: string; location?: string }[];
    return list.map((a) => ({
      id: a.id,
      label: a.type === "event" ? `${a.title}${a.date ? ` (${a.date})` : ""}` : a.title,
    }));
  }, []);

  const toggleFriend = useCallback(
    (u: StoredUser) => {
      setFriends((prev) => {
        const isFriend = prev.some((f) => f.id === u.id);
        if (isFriend) return prev.filter((f) => f.id !== u.id);
        return [...prev, { id: u.id, name: u.name }];
      });
    },
    []
  );

  const removeFriend = useCallback((id: number) => {
    setFriends((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const allPosts: (Post | UserPost)[] = [...HARDCODED_POSTS, ...userPosts];
  const visiblePosts = allPosts.filter((post) => post.channelId === selectedChannel);
  const activeFriend = useMemo(
    () => (activeFriendId != null ? friends.find((f) => f.id === activeFriendId) ?? null : null),
    [activeFriendId, friends],
  );

  const handleCreateChannel = () => {
    const name = newChannelName.trim();
    if (!name) return;
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || `group-${Date.now()}`;
    if (channels.some((c) => c.id === id)) {
      setSelectedChannel(id);
      setCreateChannelOpen(false);
      setNewChannelName("");
      return;
    }
    const newChannel: Channel = { id, name };
    setChannels((prev) => [...prev, newChannel]);
    setSelectedChannel(id);
    setCreateChannelOpen(false);
    setNewChannelName("");
  };

  const sendMessage = () => {
    const body = newPostBody.trim();
    if (!body) return;
    const name = (user.name || "You").trim() || "You";

    if (viewMode === "dm" && activeFriendId != null) {
      setDmMessages((prev) => {
        const list = prev[activeFriendId] ?? [];
        const message: DirectMessage = {
          id: String(Date.now()),
          fromUserId: user.id,
          body,
          time: "Just now",
        };
        return { ...prev, [activeFriendId]: [...list, message] };
      });
    } else {
      setUserPosts((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          channelId: selectedChannel,
          author: name,
          avatarSeed: String(user.id),
          time: "Just now",
          topic: "General",
          body,
          likes: 0,
          initialReplyCount: 0,
        },
      ]);
    }

    setNewPostBody("");
    setNewPostTopic(TOPICS[0]);
    setReplyContext(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  const toggleLike = useCallback((postId: string) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
  }, []);

  const handleReplyTo = useCallback(
    (post: Post | UserPost) => {
      const name = (post.author || "").split(" ")[0] || "friend";
      setReplyContext(post.author);
      setNewPostBody((current) => (current.trim().length === 0 ? `@${name} ` : current));
    },
    []
  );

  const sendInvites = () => {
    if (!inviteActivityId || inviteFriendIds.size === 0) return;
    setInviteSent(true);
    setTimeout(() => {
      setInviteOpen(false);
      setInviteActivityId("");
      setInviteFriendIds(new Set());
      setInviteSent(false);
    }, 1200);
  };

  const toggleInviteFriend = (id: number) => {
    setInviteFriendIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewPostBody(e.target.value);
    if (messageInputRef.current) {
      messageInputRef.current.style.height = "0px";
      const nextHeight = Math.min(messageInputRef.current.scrollHeight, 140);
      messageInputRef.current.style.height = `${nextHeight}px`;
    }
  };

  return (
    <div className="relative flex h-[calc(100vh-4rem)] min-h-0 bg-slate-50/40">
      {/* Sidebar: Friends + Channels (desktop) */}
      <aside
        className={cn(
          "hidden lg:flex shrink-0 border-r border-slate-200 bg-white flex-col overflow-hidden transition-all duration-200",
          isSidebarCollapsed ? "lg:w-16" : "lg:w-64",
        )}
      >
        {isSidebarCollapsed ? (
          <div className="flex flex-col items-center justify-between h-full py-3">
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed(false)}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
              aria-label="Expand community sidebar"
            >
              <ChevronRight size={18} />
            </button>
            <div className="flex flex-col items-center gap-4 text-slate-400">
              <button
                type="button"
                onClick={() => setAddFriendOpen(true)}
                className="p-2 rounded-xl hover:bg-slate-50 hover:text-primary"
                aria-label="Friends"
              >
                <UserPlus size={18} />
              </button>
              <button
                type="button"
                onClick={() => setCreateChannelOpen(true)}
                className="p-2 rounded-xl hover:bg-slate-50 hover:text-primary"
                aria-label="Communities"
              >
                <Hash size={18} />
              </button>
              <button
                type="button"
                onClick={() => setInviteOpen(true)}
                className="p-2 rounded-xl hover:bg-slate-50 hover:text-primary"
                aria-label="Invite to activity"
              >
                <Users size={18} />
              </button>
            </div>
            <div className="pb-1">
              <span className="text-[9px] font-semibold text-slate-400 tracking-wide rotate-[-90deg] inline-block">
                COMMUNITY
              </span>
            </div>
          </div>
        ) : (
          <>
            <div className="p-3 border-b border-slate-100 flex items-center justify-between gap-2">
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Friends</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSidebarCollapsed(true)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-500"
                aria-label="Collapse community sidebar"
              >
                <ChevronLeft size={16} />
              </button>
            </div>
            <div className="px-3 pt-2 pb-3 border-b border-slate-100">
              <button
                type="button"
                onClick={() => setAddFriendOpen(true)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-primary hover:bg-primary-light transition-colors"
              >
                <UserPlus size={18} />
                Add friend
              </button>
              <ul className="mt-2 space-y-0.5 max-h-40 overflow-y-auto">
                {friends.length === 0 ? (
                  <li className="px-3 py-2 text-slate-400 text-sm">No friends yet</li>
                ) : (
                  friends.map((f) => (
                    <li
                      key={f.id}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 group cursor-pointer",
                        viewMode === "dm" && activeFriendId === f.id && "bg-slate-100",
                      )}
                      onClick={() => {
                        setViewMode("dm");
                        setActiveFriendId(f.id);
                      }}
                    >
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${f.id}`}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="flex-1 truncate text-sm font-medium text-slate-800">{f.name}</span>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          removeFriend(f.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                        aria-label="Remove friend"
                      >
                        <X size={14} />
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
            <div className="p-3 border-b border-slate-100">
              <div className="flex items-center justify-between mb-2 gap-2">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Communities</h3>
                <button
                  type="button"
                  onClick={() => setCreateChannelOpen(true)}
                  className="text-[10px] font-medium px-2 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  + New
                </button>
              </div>
              <ul className="space-y-0.5">
                {channels.map((ch) => {
                  const Icon = ch.icon;
                  return (
                    <li key={ch.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setViewMode("channel");
                          setSelectedChannel(ch.id);
                          setActiveFriendId(null);
                        }}
                        className={cn(
                          "w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors",
                          selectedChannel === ch.id
                            ? "bg-primary-light text-primary"
                            : "text-slate-700 hover:bg-slate-50",
                        )}
                      >
                        <Icon size={18} />
                        {ch.name}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="p-3 flex-1">
              <button
                type="button"
                onClick={() => setInviteOpen(true)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 border border-slate-200 hover:border-primary/30 transition-colors"
              >
                <Users size={18} />
                Invite to activity
              </button>
            </div>
          </>
        )}
      </aside>

      {/* Main: Channel or DM content (Slack-style) */}
      <main className="flex-1 min-w-0 flex flex-col">
        <div className="px-3 sm:px-4 md:px-6 pt-2.5 sm:pt-3 pb-2.5 sm:pb-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-primary-light text-primary rounded-xl flex items-center justify-center">
              <MessageCircle size={18} className="sm:size-20" />
            </div>
            <div>
              {viewMode === "dm" && activeFriend ? (
                <>
                  <h2 className="text-sm sm:text-base font-bold flex items-center gap-1.5 sm:gap-2">
                    <span>{activeFriend.name}</span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                      Direct message
                    </span>
                  </h2>
                  <p className="text-slate-500 text-[11px] sm:text-xs">Private chat between you and this friend.</p>
                </>
              ) : (
                <>
                  <h2 className="text-sm sm:text-base font-bold flex items-center gap-1.5 sm:gap-2">
                    <span>{selectedChannel === "events" ? "#events" : "#general"}</span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                      Community
                    </span>
                  </h2>
                  <p className="text-slate-500 text-[11px] sm:text-xs">
                    {selectedChannel === "events"
                      ? "Event updates and meet-ups."
                      : "Share wins, questions, and ideas."}
                  </p>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {viewMode === "channel" && (
              <div className="hidden sm:flex items-center gap-2 text-slate-400">
                <button
                  type="button"
                  className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-slate-50 text-xs font-medium"
                >
                  <Users size={14} />
                  Members
                </button>
                <button
                  type="button"
                  className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-slate-50 text-xs font-medium"
                >
                  <Hash size={14} />
                  Channel settings
                </button>
              </div>
            )}
            <button
              type="button"
              className="inline-flex lg:hidden items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50"
              onClick={() => setIsSidebarOpen(true)}
            >
              <MessageSquare size={14} />
              Community
            </button>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 min-h-0 overflow-y-auto px-3 sm:px-4 py-3 sm:py-4 space-y-3">
          {viewMode === "dm" && activeFriendId != null ? (
            (dmMessages[activeFriendId] ?? []).map((msg, i, arr) => {
              const prevMsg = arr[i - 1];
              const isGrouped = prevMsg && prevMsg.fromUserId === msg.fromUserId;
              const isMe = msg.fromUserId === user.id;

              return (
                <article
                  key={msg.id}
                  className={cn(
                    "flex gap-2.5",
                    isMe ? "flex-row-reverse text-right" : "flex-row text-left",
                    isGrouped ? "-mt-2" : "mt-3"
                  )}
                >
                  <div className="w-8 shrink-0">
                    {!isGrouped && (
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${isMe ? user.id : activeFriendId}`}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className={cn(
                        "inline-block rounded-2xl px-3.5 py-2.5 max-w-[85%] shadow-sm transition-all animate-in fade-in slide-in-from-bottom-1 duration-200",
                        isMe 
                          ? cn("bg-primary text-white", isGrouped ? "rounded-tr-md" : "rounded-tr-2xl") 
                          : cn("bg-slate-100 text-slate-800", isGrouped ? "rounded-tl-md" : "rounded-tl-2xl")
                      )}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-line">{msg.body}</p>
                    </div>
                    {!isGrouped && <p className="mt-1 text-[10px] text-slate-400 px-1">{msg.time}</p>}
                  </div>
                </article>
              );
            })
          ) : (
            visiblePosts.map((post, i, arr) => {
              const prevPost = arr[i - 1];
              const isGrouped = prevPost && prevPost.author === post.author;

              return (
                <article key={post.id} className={cn("flex gap-3", isGrouped ? "-mt-3" : "mt-4")}>
                  <div className="w-9 shrink-0">
                    {!isGrouped && (
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.avatarSeed}`}
                        alt=""
                        className="w-9 h-9 rounded-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    {!isGrouped && (
                      <div className="flex flex-wrap items-baseline gap-2 mb-1 px-1">
                        <span className="font-bold text-slate-900 text-sm tracking-tight">{post.author}</span>
                        <span className="text-[10px] font-medium text-slate-400 uppercase">{post.time}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-light text-primary">
                          {post.topic}
                        </span>
                      </div>
                    )}
                    <div
                      className={cn(
                        "inline-block rounded-2xl bg-slate-50 px-4 py-2.5 max-w-full border border-slate-100 shadow-sm transition-all animate-in fade-in slide-in-from-bottom-1 duration-200",
                        isGrouped && "rounded-tl-md mt-0.5"
                      )}
                    >
                      <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-line font-medium">{post.body}</p>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>

        {/* Chat input bar at bottom */}
        <form onSubmit={handleSubmit} className="border-t border-slate-200 px-3 sm:px-4 py-2.5 sm:py-3 bg-white pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]">
          <div className="w-full space-y-1.5">
            {replyContext && (
              <div className="text-[11px] text-slate-500 flex items-center justify-between">
                <span>
                  Replying to <span className="font-semibold">{replyContext}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setReplyContext(null)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Cancel
                </button>
              </div>
            )}
            <div className="flex items-center gap-2">
              <textarea
                ref={messageInputRef}
                value={newPostBody}
                onChange={handleMessageChange}
                placeholder={`Message ${selectedChannel === "events" ? "#events" : "#general"}...`}
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm resize-none min-h-[44px] focus:ring-2 focus:ring-primary/20 outline-none overflow-y-hidden"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
                  title="Attach file (demo)"
                >
                  <Paperclip size={16} />
                </button>
                <button
                  type="button"
                  className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
                  title="Start voice note (demo)"
                >
                  <Mic size={16} />
                </button>
                <button
                  type="submit"
                  disabled={!newPostBody.trim()}
                  className="btn-primary inline-flex items-center gap-1 px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={16} />
                  Send
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-slate-950/40"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setIsSidebarOpen(false);
          }}
        >
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[80%] bg-white shadow-2xl border-r border-slate-200 flex flex-col overflow-hidden">
            <div className="p-3 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Community</h3>
              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-500"
                aria-label="Close community sidebar"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 flex flex-col">
              <div className="p-3 border-b border-slate-100">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Friends</h4>
                <button
                  type="button"
                  onClick={() => {
                    setIsSidebarOpen(false);
                    setAddFriendOpen(true);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-primary hover:bg-primary-light transition-colors"
                >
                  <UserPlus size={18} />
                  Add friend
                </button>
                <ul className="mt-2 space-y-0.5 max-h-36 overflow-y-auto">
                  {friends.length === 0 ? (
                    <li className="px-3 py-2 text-slate-400 text-sm">No friends yet</li>
                  ) : (
                    friends.map((f) => (
                      <li
                        key={f.id}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 group cursor-pointer",
                          viewMode === "dm" && activeFriendId === f.id && "bg-slate-100",
                        )}
                        onClick={() => {
                          setViewMode("dm");
                          setActiveFriendId(f.id);
                          setIsSidebarOpen(false);
                        }}
                      >
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${f.id}`}
                          alt=""
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span className="flex-1 truncate text-sm font-medium text-slate-800">{f.name}</span>
                      </li>
                    ))
                  )}
                </ul>
              </div>
              <div className="p-3 border-b border-slate-100">
                <div className="flex items-center justify-between mb-2 gap-2">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Communities</h4>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSidebarOpen(false);
                      setCreateChannelOpen(true);
                    }}
                    className="text-[10px] font-medium px-2 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                  >
                    + New
                  </button>
                </div>
                <ul className="space-y-0.5 max-h-40 overflow-y-auto">
                  {channels.map((ch) => {
                    const Icon = ch.icon;
                    return (
                      <li key={ch.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setViewMode("channel");
                            setSelectedChannel(ch.id);
                            setActiveFriendId(null);
                            setIsSidebarOpen(false);
                          }}
                          className={cn(
                            "w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors",
                            selectedChannel === ch.id
                              ? "bg-primary-light text-primary"
                              : "text-slate-700 hover:bg-slate-50",
                          )}
                        >
                          <Icon size={18} />
                          {ch.name}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="p-3 mt-auto">
                <button
                  type="button"
                  onClick={() => {
                    setIsSidebarOpen(false);
                    setInviteOpen(true);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 border border-slate-200 hover:border-primary/30 transition-colors"
                >
                  <Users size={18} />
                  Invite to activity
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Add friend modal */}
      {addFriendOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
          onMouseDown={(e) => e.target === e.currentTarget && setAddFriendOpen(false)}
        >
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold">Add friend</h3>
              <button type="button" onClick={() => setAddFriendOpen(false)} className="p-1 rounded-full hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>
            <div className="overflow-y-auto p-4 space-y-2">
              {allUsers.length === 0 ? (
                <p className="text-slate-500 text-sm">No other users found.</p>
              ) : (
                allUsers.map((u) => {
                  const isFriend = friends.some((f) => f.id === u.id);
                  return (
                    <div
                      key={u.id}
                      className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-50/50 border border-slate-100 transition-colors"
                    >
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.id}`}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 truncate">{u.name}</p>
                        <p className="text-xs text-slate-500 truncate">{u.email}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleFriend(u)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap",
                          isFriend 
                            ? "bg-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-500 hover:border-red-100" 
                            : "bg-primary text-white hover:bg-primary/90"
                        )}
                      >
                        {isFriend ? "Unfriend" : "Add Friend"}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create community modal */}
      {createChannelOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
          onMouseDown={(e) => e.target === e.currentTarget && setCreateChannelOpen(false)}
        >
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold">Create community</h3>
              <button
                type="button"
                onClick={() => setCreateChannelOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <label className="block text-sm font-semibold text-slate-700">
                Name
                <input
                  type="text"
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  placeholder="e.g. UQ Green Club"
                  className="mt-1 w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </label>
              <p className="text-xs text-slate-500">
                This is a demo-only community – perfect for showing how students could create their own spaces.
              </p>
            </div>
            <div className="p-4 border-t border-slate-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setCreateChannelOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateChannel}
                disabled={!newChannelName.trim()}
                className="btn-primary px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite to activity modal */}
      {inviteOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
          onMouseDown={(e) => e.target === e.currentTarget && !inviteSent && setInviteOpen(false)}
        >
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[85vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold">Invite friends to join an activity</h3>
              <button
                type="button"
                onClick={() => !inviteSent && setInviteOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>
            <div className="overflow-y-auto p-4 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Activity</label>
                <select
                  value={inviteActivityId}
                  onChange={(e) => setInviteActivityId(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                >
                  <option value="">Choose an activity or event...</option>
                  {activities.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Friends to invite</label>
                {friends.length === 0 ? (
                  <p className="text-slate-500 text-sm">Add friends first from the sidebar.</p>
                ) : (
                  <ul className="space-y-2">
                    {friends.map((f) => (
                      <li key={f.id}>
                        <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={inviteFriendIds.has(f.id)}
                            onChange={() => toggleInviteFriend(f.id)}
                            className="rounded border-slate-300 text-primary focus:ring-primary/20"
                          />
                          <img
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${f.id}`}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <span className="font-medium text-slate-800">{f.name}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 flex justify-end gap-2">
              {inviteSent ? (
                <span className="text-sm font-medium text-primary py-2">Invites sent!</span>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setInviteOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={sendInvites}
                    disabled={!inviteActivityId || inviteFriendIds.size === 0}
                    className="btn-primary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send invites
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
