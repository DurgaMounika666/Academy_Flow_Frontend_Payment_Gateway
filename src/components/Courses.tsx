/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Calculator,
  Globe,
  Book,
  Languages,
  Atom,
  Compass,
  Zap,
  FlaskConical,
  Heart,
  Code,
  Search,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  SlidersHorizontal
} from "lucide-react";
import { useCatalog } from "../context/CatalogContext";
import { useLanguage } from "../context/LanguageContext";

interface CoursesProps {
  onOpenRegister: () => void;
  onOpenDemo: () => void;
  onSelectStandard: (std: string) => void;
}

const SUBJECT_ICONS: Record<string, any> = {
  Mathematics: Calculator,
  "Environmental Studies": Globe,
  English: Book,
  Telugu: BookOpen,
  Hindi: Languages,
  "General Science": Atom,
  "Social Studies": Compass,
  Physics: Zap,
  Chemistry: FlaskConical,
  Biology: Heart,
  "Computer Science": Code,
};

const TUTOR_ROTATION = ["Dr. Anitha", "Prof. Narayana", "Mr. Anand Kumar", "Mrs. S. Lakshmi"];

export function Courses({ onOpenRegister, onOpenDemo, onSelectStandard }: CoursesProps) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { standards, subjectsByClass } = useCatalog();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStandard, setSelectedStandard] = useState("All");
  const [selectedMode, setSelectedMode] = useState("All");

  // Flatten catalog into individual courses
  const allCourses = useMemo(() => {
    const list: Array<{
      id: string;
      name: string;
      standard: string;
      tutorName: string;
      duration: string;
      mode: "Online" | "Offline";
      studentsCount: number;
    }> = [];

    let seq = 301;
    standards.forEach((std, stdIdx) => {
      const subjects = subjectsByClass[std] || [];
      subjects.forEach((sub, subIdx) => {
        list.push({
          id: `C-${seq++}`,
          name: sub,
          standard: std,
          tutorName: TUTOR_ROTATION[(stdIdx + subIdx) % TUTOR_ROTATION.length],
          duration: std === "Special Courses" ? "8 weeks" : "12 weeks",
          mode: (stdIdx + subIdx) % 2 === 0 ? "Online" : "Offline",
          studentsCount: ((stdIdx * 7 + subIdx * 13) % 20) + 15,
        });
      });
    });

    return list;
  }, [standards, subjectsByClass]);

  // Filter courses based on selections
  const filteredCourses = useMemo(() => {
    return allCourses.filter((course) => {
      const matchesSearch =
        course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.standard.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.tutorName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStandard = selectedStandard === "All" || course.standard === selectedStandard;
      const matchesMode = selectedMode === "All" || course.mode === selectedMode;

      return matchesSearch && matchesStandard && matchesMode;
    });
  }, [allCourses, searchQuery, selectedStandard, selectedMode]);

  const handleEnrollClick = (std: string) => {
    onSelectStandard(std);
    onOpenRegister();
  };

  const handleDemoClick = (std: string) => {
    onSelectStandard(std);
    onOpenDemo();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-[#0b1329] dark:text-slate-100 transition-colors duration-300">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-tr from-sky-500/10 via-indigo-500/5 to-transparent pt-12 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-6">
            <button
              onClick={() => navigate("/")}
              className="hover:text-sky-500 transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>{t("home")}</span>
            </button>
            <ChevronRight className="h-3 w-3 opacity-60" />
            <span className="text-slate-800 dark:text-slate-200">Courses</span>
          </div>

          <div className="text-left space-y-4 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest bg-sky-100/60 dark:bg-sky-950/40 px-3.5 py-1.5 rounded-full">
              <Sparkles className="h-3.5 w-3.5" />
              Academy Flow Learning Curriculum
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-none">
              Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-indigo-600">Courses Catalog</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-350 text-sm sm:text-base leading-relaxed">
              Find customized classes for standard 1st to 10th. Every tuition subject is managed by veteran tutors, backed by interactive scorecards, syllabus progression timelines, and comprehensive homework feedback systems.
            </p>
          </div>
        </div>
      </div>

      {/* Main Catalog Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
        {/* Filters Controls Panel */}
        <div className="bg-white dark:bg-slate-900/60 dark:backdrop-blur-md rounded-2xl border border-slate-200/60 dark:border-slate-800/80 p-5 shadow-sm mb-10">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search courses, standards, tutors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:focus:bg-slate-950 transition-all shadow-inner"
              />
            </div>

            {/* Selector Filters */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Standard Select */}
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-slate-400 hidden sm:inline" />
                <select
                  value={selectedStandard}
                  onChange={(e) => setSelectedStandard(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 transition-all"
                >
                  <option value="All">All Grades</option>
                  {standards.map((std) => (
                    <option key={std} value={std}>
                      {std}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mode Select */}
              <select
                value={selectedMode}
                onChange={(e) => setSelectedMode(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 transition-all"
              >
                <option value="All">All Modes</option>
                <option value="Online">Online Only</option>
                <option value="Offline">Offline Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Courses Cards Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course) => {
              const IconComponent = SUBJECT_ICONS[course.name] || BookOpen;
              return (
                <div
                  key={course.id}
                  className="group relative flex flex-col justify-between bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/65 dark:border-slate-800/80 p-5 shadow-sm hover:shadow-md hover:-translate-y-1.5 transition-all duration-300"
                >
                  <div>
                    {/* Header: Icon & Badges */}
                    <div className="flex justify-between items-start mb-4.5">
                      <div className="h-11 w-11 flex items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/45 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col gap-1 items-end">
                        <span className="text-[10px] uppercase font-extrabold tracking-wider bg-slate-100 dark:bg-slate-850 px-2 py-0.5 rounded text-slate-500 dark:text-slate-350">
                          {course.standard}
                        </span>
                        <span
                          className={`text-[9px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded ${
                            course.mode === "Online"
                              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/35 dark:text-emerald-450"
                              : "bg-amber-50 text-amber-600 dark:bg-amber-955/35 dark:text-amber-450"
                          }`}
                        >
                          {course.mode}
                        </span>
                      </div>
                    </div>

                    {/* Course details */}
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-sky-500 transition-colors">
                      {course.name}
                    </h3>

                    {/* Tutor details */}
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-1.5">
                      Tutor: <span className="font-semibold text-slate-700 dark:text-slate-300">{course.tutorName}</span>
                    </p>

                    <div className="flex gap-4 mt-4 text-[11px] text-slate-400 font-medium border-t border-slate-100 dark:border-slate-900 pt-3">
                      <span>Duration: <strong className="text-slate-600 dark:text-slate-300">{course.duration}</strong></span>
                      <span>•</span>
                      <span>Enrolled: <strong className="text-slate-600 dark:text-slate-300">{course.studentsCount}</strong></span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2.5 mt-5">
                    <button
                      onClick={() => handleEnrollClick(course.standard)}
                      className="flex-1 text-center bg-slate-900 hover:bg-slate-800 dark:bg-sky-500 dark:hover:bg-sky-400 text-white dark:text-slate-950 py-2 rounded-xl text-xs font-bold transition-all shadow active:scale-95 cursor-pointer"
                    >
                      Enroll Now
                    </button>
                    <button
                      onClick={() => handleDemoClick(course.standard)}
                      className="px-3 border border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700 bg-slate-50/50 hover:bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-300 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer"
                      title="Book Demo Lesson"
                    >
                      Demo
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center max-w-md mx-auto">
            <div className="h-14 w-14 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center text-slate-400 mb-4.5 border border-slate-200/50 dark:border-slate-800/50 shadow-inner">
              <Search className="h-6 w-6" />
            </div>
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">No Courses Found</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
              We couldn't find any courses matching your search or filters. Try adjusting your grade standard, search keywords, or class mode.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
