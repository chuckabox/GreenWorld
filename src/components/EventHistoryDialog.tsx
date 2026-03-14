import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, History, TrendingUp, Calendar, CheckCircle2 } from "lucide-react";
import { Activity } from "../types";
import { acquireBodyLock, releaseBodyLock } from "../lib/modalBodyLock";

export const EventHistoryDialog = ({
  activities,
  onClose
}: {
  activities: Activity[];
  onClose: () => void
}) => {
  const approvedActivities = activities.filter(a => a.status === 'approved');
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [dragStartY, setDragStartY] = useState<number | null>(null);
  const [dragTranslateY, setDragTranslateY] = useState(0);

  useEffect(() => {
    acquireBodyLock();
    return () => {
      releaseBodyLock();
    };
  }, []);

  const overlay = (
    <div
      className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-slate-950/40 px-2 pb-4 sm:px-4 sm:pb-8 md:pb-0 overflow-hidden"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full max-w-lg sm:max-w-xl md:max-w-xl shrink-0"
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(event) => {
          const scrollTop = scrollRef.current?.scrollTop ?? 0;
          if (scrollTop > 0) {
            setDragStartY(null);
            setDragTranslateY(0);
            return;
          }
          setDragStartY(event.touches[0].clientY);
        }}
        onTouchMove={(event) => {
          if (dragStartY == null) return;
          const scrollTop = scrollRef.current?.scrollTop ?? 0;
          if (scrollTop > 0) {
            return;
          }
          const delta = event.touches[0].clientY - dragStartY;
          if (delta > 0) {
            setDragTranslateY(delta);
          }
        }}
        onTouchEnd={() => {
          if (dragTranslateY > 80) {
            onClose();
          } else {
            setDragTranslateY(0);
          }
          setDragStartY(null);
        }}
        style={{
          transform: dragTranslateY ? `translateY(${dragTranslateY}px)` : undefined,
          transition: dragTranslateY ? "none" : "transform 0.2s ease-out",
        }}
      >
        <div
          ref={scrollRef}
          className="bg-white rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8 max-h-[90vh] overflow-y-auto modal-scroll"
        >
          <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-slate-200 sm:hidden" />
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
                <History size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Event History</h2>
                <p className="text-sm text-slate-500 font-medium tracking-tight">
                  Your lifetime record of verified sustainability actions.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

        <div className="space-y-4">
          {approvedActivities.length > 0 ? (
            approvedActivities.map((activity, i) => (
              <div key={activity.id} className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-primary/20 transition-all group">
                <div className="w-12 h-12 shrink-0 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-primary shadow-sm">
                  <CheckCircle2 size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-base text-slate-900 mb-0.5 truncate uppercase tracking-tight">
                    {activity.taskTitle ?? activity.category}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {activity.date}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-primary">
                      +{activity.pointsEarned ?? (activity.hours * 25)} pts
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Hours</p>
                  <p className="text-sm font-black text-slate-700">{activity.hours}h</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
              <TrendingUp size={48} className="mx-auto text-slate-200 mb-4" />
              <p className="text-slate-400 font-medium">No verified actions yet. Start your journey!</p>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full btn-primary h-12 flex items-center justify-center font-bold"
        >
          Got it
        </button>
      </div>
    </div>
  </div>
  );

  return createPortal(overlay, document.body);
};
