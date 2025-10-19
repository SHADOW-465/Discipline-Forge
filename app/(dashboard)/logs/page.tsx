"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Star, 
  Smile, 
  Frown, 
  Meh,
  Plus,
  Edit,
  Trash2,
  CheckCircle
} from "lucide-react";

export default function LogsPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    complianceRating: 5,
    journalEntry: "",
    mood: "" as "great" | "okay" | "difficult" | "",
  });

  const todaysLog = useQuery(api.logs.getTodaysLog);
  const dailyLogs = useQuery(api.logs.getUserDailyLogs, { limit: 30 });
  const activeChallenges = useQuery(api.challenges.getUserActiveChallenges);

  const createOrUpdateLog = useMutation(api.logs.createOrUpdateDailyLog);

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createOrUpdateLog({
        logDate: today,
        complianceRating: formData.complianceRating,
        journalEntry: formData.journalEntry,
        mood: formData.mood,
        completedChallenges: [], // TODO: Add challenge selection
      });
      
      setIsCreating(false);
      setIsEditing(null);
      setFormData({
        complianceRating: 5,
        journalEntry: "",
        mood: "",
      });
    } catch (error) {
      console.error("Error saving log:", error);
    }
  };

  const handleEdit = (log: any) => {
    setFormData({
      complianceRating: log.complianceRating,
      journalEntry: log.journalEntry,
      mood: log.mood,
    });
    setIsEditing(log._id);
    setIsCreating(true);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setIsEditing(null);
    setFormData({
      complianceRating: 5,
      journalEntry: "",
      mood: "",
    });
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case "great":
        return <Smile className="h-4 w-4 text-green-500" />;
      case "okay":
        return <Meh className="h-4 w-4 text-yellow-500" />;
      case "difficult":
        return <Frown className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getMoodBadgeVariant = (mood: string) => {
    switch (mood) {
      case "great":
        return "default";
      case "okay":
        return "secondary";
      case "difficult":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Daily Logs</h1>
          <p className="text-slate-400">Track your daily progress and reflections</p>
        </div>
        {!todaysLog && !isCreating && (
          <Button
            onClick={() => setIsCreating(true)}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Today's Log
          </Button>
        )}
      </div>

      {/* Today's Log Form */}
      {isCreating && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-emerald-500" />
              {isEditing ? "Edit Today's Log" : "Today's Log"}
            </CardTitle>
            <CardDescription className="text-slate-400">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Compliance Rating */}
              <div className="space-y-2">
                <Label className="text-slate-300">Compliance Rating</Label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, complianceRating: rating }))}
                      className={`p-2 rounded-full transition-colors ${
                        rating <= formData.complianceRating
                          ? "text-emerald-500"
                          : "text-slate-400 hover:text-slate-300"
                      }`}
                    >
                      <Star className="h-6 w-6 fill-current" />
                    </button>
                  ))}
                  <span className="text-slate-400 ml-2">
                    {formData.complianceRating}/5
                  </span>
                </div>
              </div>

              {/* Mood Selection */}
              <div className="space-y-2">
                <Label className="text-slate-300">Mood</Label>
                <div className="flex space-x-2">
                  {[
                    { value: "great", label: "Great", icon: Smile },
                    { value: "okay", label: "Okay", icon: Meh },
                    { value: "difficult", label: "Difficult", icon: Frown },
                  ].map((mood) => {
                    const Icon = mood.icon;
                    return (
                      <button
                        key={mood.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, mood: mood.value as any }))}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                          formData.mood === mood.value
                            ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                            : "border-slate-600 text-slate-300 hover:border-slate-500"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{mood.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Journal Entry */}
              <div className="space-y-2">
                <Label className="text-slate-300">Journal Entry</Label>
                <Textarea
                  value={formData.journalEntry}
                  onChange={(e) => setFormData(prev => ({ ...prev, journalEntry: e.target.value }))}
                  placeholder="How did today go? What challenges did you face? What are you proud of?"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                  rows={4}
                />
              </div>

              {/* Active Challenges */}
              {activeChallenges && activeChallenges.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-slate-300">Completed Challenges</Label>
                  <div className="space-y-2">
                    {activeChallenges.map((userChallenge) => (
                      <div
                        key={userChallenge._id}
                        className="flex items-center space-x-2 p-3 bg-slate-700 rounded-lg"
                      >
                        <input
                          type="checkbox"
                          className="rounded border-slate-600 bg-slate-700 text-emerald-500 focus:ring-emerald-500"
                        />
                        <span className="text-slate-300">
                          {userChallenge.challenge?.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex space-x-2">
                <Button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Save Log
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Today's Log Display */}
      {todaysLog && !isCreating && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-emerald-500" />
                  Today's Log
                </CardTitle>
                <CardDescription className="text-slate-400">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </CardDescription>
              </div>
              <Button
                onClick={() => handleEdit(todaysLog)}
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Compliance Rating:</span>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= todaysLog.complianceRating
                          ? "text-emerald-500 fill-current"
                          : "text-slate-600"
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Mood:</span>
                <Badge variant={getMoodBadgeVariant(todaysLog.mood)}>
                  {getMoodIcon(todaysLog.mood)}
                  <span className="ml-1">{todaysLog.mood || "Not set"}</span>
                </Badge>
              </div>
              
              {todaysLog.journalEntry && (
                <div>
                  <span className="text-slate-300 block mb-2">Journal Entry:</span>
                  <p className="text-slate-400 bg-slate-700 p-3 rounded">
                    {todaysLog.journalEntry}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Log History */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Logs</CardTitle>
          <CardDescription className="text-slate-400">
            Your daily progress over the last 30 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          {dailyLogs && dailyLogs.length > 0 ? (
            <div className="space-y-4">
              {dailyLogs.map((log) => (
                <div
                  key={log._id}
                  className="flex items-center justify-between p-4 bg-slate-700 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-slate-300">
                      {new Date(log.logDate).toLocaleDateString()}
                    </div>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= log.complianceRating
                              ? "text-emerald-500 fill-current"
                              : "text-slate-600"
                          }`}
                        />
                      ))}
                    </div>
                    {log.mood && (
                      <Badge variant={getMoodBadgeVariant(log.mood)}>
                        {getMoodIcon(log.mood)}
                        <span className="ml-1">{log.mood}</span>
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {log.journalEntry && (
                      <span className="text-slate-400 text-sm">
                        {log.journalEntry.length > 50 
                          ? `${log.journalEntry.substring(0, 50)}...`
                          : log.journalEntry
                        }
                      </span>
                    )}
                    <Button
                      onClick={() => handleEdit(log)}
                      variant="outline"
                      size="sm"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-400">No logs found</p>
              <p className="text-slate-500 text-sm">Start logging your daily progress!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
