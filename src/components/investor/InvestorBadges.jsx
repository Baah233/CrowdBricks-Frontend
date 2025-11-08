import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Star, TrendingUp, Target, Zap, Crown } from "lucide-react";

export function InvestorBadges({ investments, stats, dark }) {
  const badges = useMemo(() => {
    const earned = [];
    
    // First Investment Badge
    if (investments.length > 0) {
      earned.push({
        id: "first_investment",
        name: "First Step",
        description: "Made your first investment",
        icon: <Zap className="h-6 w-6" />,
        color: "from-blue-500 to-cyan-500",
        date: investments[investments.length - 1]?.date
      });
    }
    
    // Early Adopter (5+ investments)
    if (investments.length >= 5) {
      earned.push({
        id: "early_adopter",
        name: "Early Adopter",
        description: "Invested in 5 different projects",
        icon: <Star className="h-6 w-6" />,
        color: "from-purple-500 to-pink-500"
      });
    }
    
    // Big Spender (₵100k+ total invested)
    if (stats.totalInvested >= 100000) {
      earned.push({
        id: "big_spender",
        name: "High Roller",
        description: "Invested over ₵100,000",
        icon: <Crown className="h-6 w-6" />,
        color: "from-yellow-500 to-orange-500"
      });
    }
    
    // Diversified Portfolio (3+ different project types)
    const types = [...new Set(investments.map(i => i.type))];
    if (types.length >= 3) {
      earned.push({
        id: "diversified",
        name: "Diversifier",
        description: "Invested in 3+ property types",
        icon: <Target className="h-6 w-6" />,
        color: "from-green-500 to-emerald-500"
      });
    }
    
    // Profitable Investor (positive returns)
    if (stats.totalReturns > 0) {
      earned.push({
        id: "profitable",
        name: "Profit Maker",
        description: "Earned positive returns",
        icon: <TrendingUp className="h-6 w-6" />,
        color: "from-emerald-500 to-teal-500"
      });
    }
    
    return earned;
  }, [investments, stats]);

  const totalXP = useMemo(() => {
    let xp = 0;
    xp += investments.length * 100; // 100 XP per investment
    xp += Math.floor(stats.totalInvested / 10000) * 50; // 50 XP per ₵10k invested
    xp += badges.length * 500; // 500 XP per badge
    return xp;
  }, [investments, stats, badges]);

  const level = Math.floor(totalXP / 1000) + 1;
  const xpForNextLevel = (level * 1000);
  const xpProgress = (totalXP % 1000) / 1000 * 100;

  return (
    <Card className={dark ? "bg-slate-800 border-slate-700" : "bg-white"}>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${dark ? "text-white" : ""}`}>
          <Award className="h-5 w-5 text-yellow-500" />
          Achievements & Rewards
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Level & XP */}
        <div className={`p-4 rounded-lg mb-4 ${dark ? "bg-slate-900/50" : "bg-gradient-to-r from-blue-50 to-purple-50"}`}>
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Level {level}
              </div>
              <div className="text-xs text-slate-500">Investor Status</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-lg">{totalXP} XP</div>
              <div className="text-xs text-slate-500">{xpForNextLevel - totalXP} to next level</div>
            </div>
          </div>
          
          {/* XP Progress Bar */}
          <div className={`h-2 rounded-full overflow-hidden ${dark ? "bg-slate-700" : "bg-slate-200"}`}>
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
        </div>

        {/* Badges */}
        {badges.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Award className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <div>Start investing to earn badges!</div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {badges.map(badge => (
              <div
                key={badge.id}
                className={`p-3 rounded-lg border ${
                  dark 
                    ? "border-slate-700 bg-slate-900/50 hover:border-slate-600" 
                    : "border-slate-200 bg-slate-50 hover:border-slate-300"
                } transition-all cursor-pointer group`}
              >
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${badge.color} flex items-center justify-center text-white mb-2 group-hover:scale-110 transition-transform`}>
                  {badge.icon}
                </div>
                <div className="font-medium text-sm">{badge.name}</div>
                <div className="text-xs text-slate-500 mt-1">{badge.description}</div>
                {badge.date && (
                  <div className="text-xs text-slate-400 mt-1">Earned: {badge.date}</div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Locked Badges Preview */}
        {badges.length < 5 && (
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <div className="text-xs font-medium text-slate-500 mb-2">Locked Achievements</div>
            <div className="grid grid-cols-3 gap-2">
              {[...Array(5 - badges.length)].map((_, i) => (
                <div
                  key={i}
                  className={`p-2 rounded-lg border border-dashed ${
                    dark ? "border-slate-700" : "border-slate-300"
                  } opacity-50`}
                >
                  <div className={`w-8 h-8 rounded-full ${dark ? "bg-slate-700" : "bg-slate-200"} mx-auto`} />
                  <div className={`h-2 rounded mt-2 ${dark ? "bg-slate-700" : "bg-slate-200"}`} />
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
