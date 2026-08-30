"use client";

import { useState } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
  useSortable,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { supabase } from "@/lib/supabase/client";
import type { CommunityTweet } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

function extractTweetId(urlOrId: string): string | null {
  const trimmed = urlOrId.trim();
  // If it's just digits, it's already a tweet ID
  if (/^\d+$/.test(trimmed)) return trimmed;
  // Match twitter.com/x.com status URLs: /status/123456789
  const match = trimmed.match(/(?:twitter\.com|x\.com)\/(?:\w+\/)?status\/(\d+)/i);
  return match ? match[1] : null;
}

function SortableTweetCard({
  tweet,
  onDelete,
}: {
  tweet: CommunityTweet;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: tweet.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className={`p-3 py-5 group ${isDragging ? "opacity-50 shadow-lg z-10" : ""}`}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <button
              type="button"
              className="cursor-grab active:cursor-grabbing touch-none p-1 rounded hover:bg-white/10 text-muted-foreground hover:text-foreground shrink-0"
              {...attributes}
              {...listeners}
              aria-label="Drag to reorder"
            >
              <GripVertical className="w-4 h-4" />
            </button>
            <div className="min-w-0 flex-1">
              {tweet.author_name ? (
                <>
                  <p className="text-sm font-medium text-foreground truncate">
                    {tweet.author_name}
                    {tweet.author_handle && (
                      <span className="text-muted-foreground font-normal ml-1">
                        {tweet.author_handle}
                      </span>
                    )}
                  </p>
                  {tweet.text_excerpt && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                      {tweet.text_excerpt}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm font-mono text-muted-foreground truncate">
                  ID: {tweet.tweet_id}
                </p>
              )}
              <a
                href={`https://x.com/i/status/${tweet.tweet_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline truncate block mt-1"
              >
                View on X
              </a>
            </div>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive cursor-pointer"
              onClick={onDelete}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

interface AdminCommunityClientProps {
  initialTweets: CommunityTweet[];
}

export function AdminCommunityClient({ initialTweets }: AdminCommunityClientProps) {
  const [tweets, setTweets] = useState<CommunityTweet[]>(initialTweets);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tweetUrl, setTweetUrl] = useState("");
  const [error, setError] = useState("");

  function openCreate() {
    setTweetUrl("");
    setError("");
    setIsModalOpen(true);
  }

  async function handleAdd() {
    setError("");
    const tweetId = extractTweetId(tweetUrl);
    if (!tweetId) {
      setError("Invalid or missing tweet ID. Paste a full X/Twitter post URL (e.g. https://x.com/user/status/123456789) or just the tweet ID.");
      return;
    }

    const { data, error: insertError } = await supabase
      .from("community_tweets")
      .insert({ tweet_id: tweetId, display_order: tweets.length + 1 })
      .select()
      .single();

    if (insertError) {
      if (insertError.code === "23505") {
        setError("This tweet is already in the Wall of Love.");
      } else {
        setError(insertError.message);
      }
      return;
    }

    if (data) {
      const newTweet = data as CommunityTweet;
      try {
        const res = await fetch(`/api/tweet/${newTweet.tweet_id}`);
        if (res.ok) {
          const meta = await res.json();
          setTweets([
            ...tweets,
            {
              ...newTweet,
              author_name: meta.author_name,
              author_handle: meta.author_handle,
              text_excerpt: meta.text_excerpt,
            },
          ]);
        } else {
          setTweets([...tweets, newTweet]);
        }
      } catch {
        setTweets([...tweets, newTweet]);
      }
      setIsModalOpen(false);
    }
  }

  async function handleDelete(id: string) {
    if (confirm("Remove this tweet from the Wall of Love?")) {
      const { error: deleteError } = await supabase
        .from("community_tweets")
        .delete()
        .eq("id", id);

      if (!deleteError) {
        setTweets(tweets.filter((t) => t.id !== id));
      }
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = tweets.findIndex((t) => t.id === active.id);
    const newIndex = tweets.findIndex((t) => t.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(tweets, oldIndex, newIndex);
    setTweets(reordered);

    const updates = reordered.map((t, i) =>
      supabase.from("community_tweets").update({ display_order: i + 1 }).eq("id", t.id)
    );
    await Promise.all(updates);
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Community — Wall of Love</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage X/Twitter posts displayed in the landing page Wall of Love. Add tweet URLs, drag to reorder.
          </p>
        </div>
        <Button onClick={openCreate} className="cursor-pointer">
          <Plus className="w-4 h-4 mr-2" /> Add Tweet
        </Button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={tweets.map((t) => t.id)} strategy={rectSortingStrategy}>
          <div className="flex flex-col md:flex-row gap-4 h-fit">
            {(() => {
              const cols = 3;
              const chunkSize = Math.ceil(tweets.length / cols);
              const columns = Array.from({ length: cols }, (_, i) =>
                tweets.slice(i * chunkSize, (i + 1) * chunkSize)
              );
              return columns.map((colTweets, colIndex) => (
                <div
                  key={colIndex}
                  className="flex flex-col gap-4 flex-1 min-w-0"
                >
                  {colTweets.map((tweet) => (
                    <SortableTweetCard
                      key={tweet.id}
                      tweet={tweet}
                      onDelete={() => handleDelete(tweet.id)}
                    />
                  ))}
                </div>
              ));
            })()}
          </div>
        </SortableContext>
      </DndContext>

      {tweets.length === 0 && (
        <p className="text-sm text-muted-foreground mt-6">
          No tweets yet. Click &quot;Add Tweet&quot; to add X posts to the Wall of Love.
        </p>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg bg-background border-border/50 text-foreground [&_input]:bg-[#171717] [&_input]:border-border/50 [&_button]:cursor-pointer">
          <DialogHeader>
            <DialogTitle>Add X/Twitter Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Tweet URL or ID</Label>
              <Input
                placeholder="https://x.com/username/status/1234567890 or 1234567890"
                value={tweetUrl}
                onChange={(e) => {
                  setTweetUrl(e.target.value);
                  setError("");
                }}
                className="cursor-text"
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="cursor-pointer bg-background border-border/50 hover:bg-[#171717] hover:text-white"
            >
              Cancel
            </Button>
            <Button onClick={handleAdd} className="cursor-pointer">
              Add Tweet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
