import React, { useState } from "react";
import {
  House,
  ChatTeardrop,
  Plus,
  MagnifyingGlass,
  SidebarSimple,
  Buildings,
  Users,
  Target,
  CheckSquare,
  Note,
  SquaresFour,
  GitFork,
  Gear,
  BookOpen,
  CaretDown,
  CaretRight,
  CaretUp,
  Heart,
  EnvelopeSimple,
  Command,
  ArrowUpRight,
  Paperclip,
  CalendarBlank,
  PencilSimple,
  LinkSimple,
  MapPin,
  Briefcase,
  User,
  CurrencyDollar,
} from "@phosphor-icons/react";

export function TwentyDashboard() {
  const [activeTab, setActiveTab] = useState("Timeline");
  const [expandedFields, setExpandedFields] = useState(true);
  const [expandedGeneral, setExpandedGeneral] = useState(true);
  const [expandedBusiness, setExpandedBusiness] = useState(true);
  const [expandedContact, setExpandedContact] = useState(true);
  const [expandedSystem, setExpandedSystem] = useState(true);
  const [expandedUpdateCard, setExpandedUpdateCard] = useState(true);
  const [activeNav, setActiveNav] = useState("Companies");

  return (
    <div className="flex h-screen w-full flex-col bg-[#fbfbfb] text-[#1f1f1f] antialiased select-none font-sans text-xs">
      {/* Main Grid Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT NAV SIDEBAR */}
        <aside className="w-56 shrink-0 border-r border-[#e8e8e8] bg-[#f7f7f8] flex flex-col justify-between">
          <div className="flex flex-col">
            {/* Top Workspace Selector & Header Icons */}
            <div className="p-3 pb-2 space-y-3 border-b border-[#ececec]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 cursor-pointer hover:bg-black/5 p-1 rounded transition">
                  <div className="size-5 rounded bg-[#1f1f1f] text-white flex items-center justify-center text-[10px] font-bold">
                    AS
                  </div>
                  <span className="font-semibold text-xs text-[#111]">AS Mobbin</span>
                  <CaretDown className="size-3 text-[#777]" />
                </div>
                <div className="flex items-center gap-1 text-[#666]">
                  <button className="p-1 hover:bg-black/5 rounded transition">
                    <MagnifyingGlass className="size-3.5" />
                  </button>
                  <button className="p-1 hover:bg-black/5 rounded transition">
                    <SidebarSimple className="size-3.5" />
                  </button>
                </div>
              </div>

              {/* Home / Chat Row */}
              <div className="flex items-center gap-1.5 pt-1">
                <button className="p-1.5 hover:bg-black/5 rounded text-[#555]">
                  <House className="size-3.5" />
                </button>
                <button className="p-1.5 hover:bg-black/5 rounded text-[#555]">
                  <ChatTeardrop className="size-3.5" />
                </button>
                <button className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-[#d5d5d5] bg-white text-[#333] hover:bg-gray-50 text-[11px] font-medium ml-auto shadow-xs">
                  <Plus className="size-3" />
                  <span>New chat</span>
                </button>
              </div>
            </div>

            {/* Navigation Lists */}
            <div className="p-3 space-y-4 overflow-y-auto">
              {/* Workspace Group */}
              <div>
                <div className="px-2 pb-1.5 text-[10px] font-semibold text-[#888] uppercase tracking-wider">
                  Workspace
                </div>
                <nav className="space-y-0.5">
                  {[
                    { name: "Companies", icon: Buildings },
                    { name: "People", icon: Users },
                    { name: "Opportunities", icon: Target },
                    { name: "Tasks", icon: CheckSquare },
                    { name: "Notes", icon: Note },
                    { name: "Dashboards", icon: SquaresFour },
                    { name: "Workflows", icon: GitFork, hasArrow: true },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isActive = activeNav === item.name;
                    return (
                      <button
                        key={item.name}
                        onClick={() => setActiveNav(item.name)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition ${
                          isActive
                            ? "bg-[#e8ebf0] text-[#1c4ed8]"
                            : "text-[#444] hover:bg-black/5"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon
                            className={`size-4 ${
                              isActive ? "text-[#1c4ed8]" : "text-[#666]"
                            }`}
                          />
                          <span>{item.name}</span>
                        </div>
                        {item.hasArrow && (
                          <CaretRight className="size-3 text-[#999]" />
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Other Group */}
              <div>
                <div className="px-2 pb-1.5 text-[10px] font-semibold text-[#888] uppercase tracking-wider">
                  Other
                </div>
                <nav className="space-y-0.5">
                  {[
                    { name: "Settings", icon: Gear },
                    { name: "Documentation", icon: BookOpen },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.name}
                        onClick={() => setActiveNav(item.name)}
                        className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-[#444] hover:bg-black/5 transition`}
                      >
                        <Icon className="size-4 text-[#666]" />
                        <span>{item.name}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>
        </aside>

        {/* TOP BREADCRUMB & CONTENT WRAPPER */}
        <div className="flex-1 flex flex-col min-w-0 bg-white">
          {/* Header Action Bar */}
          <header className="h-11 border-b border-[#e9e9e9] px-4 flex items-center justify-between shrink-0 bg-[#fafafa]">
            {/* Breadcrumb Left */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#888] hover:underline cursor-pointer">Companies</span>
              <span className="text-[#ccc]">/</span>
              <div className="flex items-center gap-1.5 font-semibold text-[#111]">
                <Buildings className="size-3.5 text-[#3b82f6]" />
                <span>Mobbin</span>
                <span className="text-[#888] font-normal text-[11px]">(0/6)</span>
              </div>
            </div>

            {/* Actions Right */}
            <div className="flex items-center gap-1.5 text-[#555]">
              <button className="p-1 hover:bg-black/5 rounded text-[#777]">
                <CaretDown className="size-3.5" />
              </button>
              <button className="p-1 hover:bg-black/5 rounded text-[#777]">
                <CaretUp className="size-3.5" />
              </button>
              <button className="p-1 hover:bg-black/5 rounded text-[#777]">
                <Heart className="size-3.5" />
              </button>
              <button className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-[#d5d5d5] bg-white text-[#333] hover:bg-gray-50 text-xs font-medium shadow-2xs">
                <EnvelopeSimple className="size-3.5 text-[#555]" />
                <span>Send Email</span>
              </button>
              <div className="ml-1 px-1.5 py-0.5 border border-[#e0e0e0] rounded bg-[#f5f5f5] text-[10px] text-[#777] font-mono flex items-center gap-0.5">
                <Command className="size-2.5" />
                <span>K</span>
              </div>
            </div>
          </header>

          {/* DUAL PANES CONTAINER */}
          <div className="flex-1 flex overflow-hidden">
            {/* MIDDLE ENTITY COLUMN (Mobbin Details & Fields) */}
            <div className="w-[310px] shrink-0 border-r border-[#ececec] flex flex-col bg-white overflow-y-auto">
              {/* Header Info Box */}
              <div className="p-5 flex flex-col items-center justify-center border-b border-[#ececec]">
                <div className="size-11 rounded-lg bg-black text-white flex items-center justify-center font-bold text-xl tracking-tighter mb-2 shadow-sm">
                  m
                </div>
                <h1 className="text-base font-bold text-[#111]">Mobbin</h1>
                <p className="text-[11px] text-[#888] mt-0.5">Added 27 minutes ago</p>
              </div>

              {/* Accordion Sections */}
              <div className="p-3 space-y-4">
                {/* FIELDS SECTION */}
                <div>
                  <div
                    onClick={() => setExpandedFields(!expandedFields)}
                    className="flex items-center justify-between cursor-pointer py-1 font-semibold text-xs text-[#222]"
                  >
                    <span>Fields</span>
                    {expandedFields ? (
                      <CaretDown className="size-3 text-[#777]" />
                    ) : (
                      <CaretRight className="size-3 text-[#777]" />
                    )}
                  </div>

                  {expandedFields && (
                    <div className="mt-2 space-y-3 pl-1">
                      {/* General */}
                      <div>
                        <div
                          onClick={() => setExpandedGeneral(!expandedGeneral)}
                          className="flex items-center justify-between cursor-pointer py-1 text-[11px] text-[#777] font-medium"
                        >
                          <span>General</span>
                          {expandedGeneral ? (
                            <CaretDown className="size-2.5 text-[#888]" />
                          ) : (
                            <CaretRight className="size-2.5 text-[#888]" />
                          )}
                        </div>

                        {expandedGeneral && (
                          <div className="mt-1 space-y-2 pl-2 text-xs">
                            <div className="flex items-center justify-between py-1">
                              <span className="text-[#777] flex items-center gap-1.5">
                                <LinkSimple className="size-3 text-[#999]" />
                                Domain Name
                              </span>
                              <span className="px-2 py-0.5 rounded-full border border-[#e0e0e0] bg-[#f7f7f8] text-[#333] text-[11px]">
                                mobbin.com
                              </span>
                            </div>
                            <div className="flex items-center justify-between py-1">
                              <span className="text-[#777] flex items-center gap-1.5">
                                <User className="size-3 text-[#999]" />
                                Account Owner
                              </span>
                              <div className="flex items-center gap-1.5">
                                <div className="size-4 rounded-full bg-[#16a34a] text-white flex items-center justify-center text-[9px] font-bold">
                                  A
                                </div>
                                <span className="text-[#222] font-medium">Alex Smith</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Business */}
                      <div>
                        <div
                          onClick={() => setExpandedBusiness(!expandedBusiness)}
                          className="flex items-center justify-between cursor-pointer py-1 text-[11px] text-[#777] font-medium"
                        >
                          <span>Business</span>
                          {expandedBusiness ? (
                            <CaretDown className="size-2.5 text-[#888]" />
                          ) : (
                            <CaretRight className="size-2.5 text-[#888]" />
                          )}
                        </div>

                        {expandedBusiness && (
                          <div className="mt-1 space-y-2 pl-2 text-xs">
                            <div className="flex items-center justify-between py-1">
                              <span className="text-[#777] flex items-center gap-1.5">
                                <CurrencyDollar className="size-3 text-[#999]" />
                                ARR
                              </span>
                              <span className="text-[#222] font-medium">$ 8.5m</span>
                            </div>
                            <div className="flex items-center justify-between py-1">
                              <span className="text-[#777] flex items-center gap-1.5">
                                <Users className="size-3 text-[#999]" />
                                Employees
                              </span>
                              <span className="text-[#222] font-medium">45</span>
                            </div>
                            <div className="flex items-center justify-between py-1">
                              <span className="text-[#777] flex items-center gap-1.5">
                                <Target className="size-3 text-[#999]" />
                                ICP
                              </span>
                              <span className="flex items-center gap-1 text-[#16a34a] text-[11px] font-semibold">
                                ✓ True
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Contact */}
                      <div>
                        <div
                          onClick={() => setExpandedContact(!expandedContact)}
                          className="flex items-center justify-between cursor-pointer py-1 text-[11px] text-[#777] font-medium"
                        >
                          <span>Contact</span>
                          {expandedContact ? (
                            <CaretDown className="size-2.5 text-[#888]" />
                          ) : (
                            <CaretRight className="size-2.5 text-[#888]" />
                          )}
                        </div>

                        {expandedContact && (
                          <div className="mt-1 space-y-2 pl-2 text-xs">
                            <div className="flex items-center justify-between py-1">
                              <span className="text-[#777] flex items-center gap-1.5">
                                <MapPin className="size-3 text-[#999]" />
                                Address
                              </span>
                              <span className="text-[#666]">Address</span>
                            </div>
                            <div className="flex items-center justify-between py-1">
                              <span className="text-[#777] flex items-center gap-1.5">
                                <Briefcase className="size-3 text-[#999]" />
                                Linkedin
                              </span>
                              <span className="px-2 py-0.5 rounded-full border border-[#e0e0e0] bg-[#f7f7f8] text-[#333] text-[11px]">
                                mobbin
                              </span>
                            </div>
                            <div className="flex items-center justify-between py-1">
                              <span className="text-[#777] flex items-center gap-1.5">
                                X
                              </span>
                              <span className="text-[#666]">X</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* System */}
                      <div>
                        <div
                          onClick={() => setExpandedSystem(!expandedSystem)}
                          className="flex items-center justify-between cursor-pointer py-1 text-[11px] text-[#777] font-medium"
                        >
                          <span>System</span>
                          {expandedSystem ? (
                            <CaretDown className="size-2.5 text-[#888]" />
                          ) : (
                            <CaretRight className="size-2.5 text-[#888]" />
                          )}
                        </div>

                        {expandedSystem && (
                          <div className="mt-1 space-y-2 pl-2 text-xs">
                            <div className="flex items-center justify-between py-1">
                              <span className="text-[#777] flex items-center gap-1.5">
                                Creation date
                              </span>
                              <span className="text-[#222]">27 minutes ago</span>
                            </div>
                            <div className="flex items-center justify-between py-1">
                              <span className="text-[#777] flex items-center gap-1.5">
                                Created by
                              </span>
                              <div className="flex items-center gap-1.5">
                                <div className="size-4 rounded-full bg-[#16a34a] text-white flex items-center justify-center text-[9px] font-bold">
                                  A
                                </div>
                                <span className="text-[#222] font-medium">Alex Smith</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* PEOPLE SECTION */}
                <div className="pt-2 border-t border-[#f0f0f0]">
                  <div className="flex items-center justify-between py-1 font-semibold text-xs text-[#222]">
                    <span>People</span>
                    <div className="flex items-center gap-1 text-[#777]">
                      <ArrowUpRight className="size-3.5 hover:text-black cursor-pointer" />
                      <Plus className="size-3.5 hover:text-black cursor-pointer" />
                    </div>
                  </div>
                  <div className="mt-2 space-y-1.5">
                    <div className="flex items-center gap-2 p-1.5 rounded-md border border-[#e5e5e5] bg-white hover:bg-gray-50 cursor-pointer">
                      <div className="size-5 rounded bg-[#84cc16] text-white flex items-center justify-center text-[10px] font-bold">
                        B
                      </div>
                      <span className="font-medium text-xs text-[#222]">Brian Chesky</span>
                    </div>
                    <div className="flex items-center gap-2 p-1.5 rounded-md border border-[#e5e5e5] bg-white hover:bg-gray-50 cursor-pointer">
                      <div className="size-5 rounded bg-[#a855f7] text-white flex items-center justify-center text-[10px] font-bold">
                        D
                      </div>
                      <span className="font-medium text-xs text-[#222]">Dylan Field</span>
                    </div>
                    <div className="size-6 rounded border border-dashed border-[#ccc] bg-[#f9f9f9] flex items-center justify-center text-[#888] cursor-pointer hover:bg-gray-100">
                      <Plus className="size-3" />
                    </div>
                  </div>
                </div>

                {/* OPPORTUNITIES SECTION */}
                <div className="pt-2 border-t border-[#f0f0f0]">
                  <div className="flex items-center justify-between py-1 font-semibold text-xs text-[#222]">
                    <span>Opportunities</span>
                    <div className="flex items-center gap-1 text-[#777]">
                      <ArrowUpRight className="size-3.5 hover:text-black cursor-pointer" />
                      <Plus className="size-3.5 hover:text-black cursor-pointer" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT MAIN PANEL (Tabs & Timeline Activity Stream) */}
            <div className="flex-1 flex flex-col bg-white overflow-hidden">
              {/* Tab Navigation Header */}
              <div className="h-10 border-b border-[#ececec] px-4 flex items-center gap-6 bg-white shrink-0">
                {[
                  { name: "Timeline", icon: Target },
                  { name: "Tasks", icon: CheckSquare },
                  { name: "Notes", icon: Note },
                  { name: "Files", icon: Paperclip },
                  { name: "Emails", icon: EnvelopeSimple },
                  { name: "Calendar", icon: CalendarBlank },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.name;
                  return (
                    <button
                      key={tab.name}
                      onClick={() => setActiveTab(tab.name)}
                      className={`relative h-full flex items-center gap-1.5 text-xs font-medium transition ${
                        isActive
                          ? "text-[#111] font-semibold"
                          : "text-[#666] hover:text-[#222]"
                      }`}
                    >
                      <Icon className="size-3.5" />
                      <span>{tab.name}</span>
                      {isActive && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1f1f1f]" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Main Content Stream Area */}
              <div className="flex-1 overflow-y-auto p-6">
                {activeTab === "Timeline" && (
                  <div className="max-w-2xl space-y-6">
                    {/* Date Marker */}
                    <div className="text-[11px] font-semibold text-[#888] border-b border-[#f0f0f0] pb-2">
                      May 2026
                    </div>

                    {/* Activity Line Items */}
                    <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-[#e2e2e2]">
                      {/* Activity 1: Updated 7 fields card */}
                      <div className="relative">
                        <div className="absolute -left-6 top-0.5 size-4 rounded-full border border-[#d0d0d0] bg-white flex items-center justify-center text-[#666]">
                          <PencilSimple className="size-2.5" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between text-xs text-[#222]">
                            <div className="flex items-center gap-1.5 font-medium">
                              <span>You updated 7 fields on Mobbin</span>
                              <button
                                onClick={() => setExpandedUpdateCard(!expandedUpdateCard)}
                                className="p-0.5 hover:bg-black/5 rounded"
                              >
                                {expandedUpdateCard ? (
                                  <CaretUp className="size-3 text-[#777]" />
                                ) : (
                                  <CaretDown className="size-3 text-[#777]" />
                                )}
                              </button>
                            </div>
                            <span className="text-[11px] text-[#888]">10 minutes ago</span>
                          </div>

                          {expandedUpdateCard && (
                            <div className="mt-3 p-3.5 rounded-lg border border-[#e5e5e5] bg-[#fafafa] space-y-2 text-xs text-[#333]">
                              <div className="flex items-center gap-2">
                                <Buildings className="size-3.5 text-[#666]" />
                                <span className="text-[#666]">Name</span>
                                <span className="text-[#999]">→</span>
                                <span className="font-semibold text-[#111]">Mobbin</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="size-3.5 text-[#666]" />
                                <span className="text-[#666]">Address</span>
                                <span className="text-[#999]">→</span>
                                <span className="font-medium text-[#222]">
                                  75 Ayer Rajah Crescent,Singapore,139953,Singa...
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="size-3.5 text-[#666]" />
                                <span className="text-[#666]">Employees</span>
                                <span className="text-[#999]">→</span>
                                <span className="font-semibold text-[#111]">45</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <LinkSimple className="size-3.5 text-[#666]" />
                                <span className="text-[#666]">Domain Name</span>
                                <span className="text-[#999]">→</span>
                                <span className="px-2 py-0.5 rounded-full border border-[#e0e0e0] bg-white text-[#333] text-[11px]">
                                  mobbin.com
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Briefcase className="size-3.5 text-[#666]" />
                                <span className="text-[#666]">Linkedin</span>
                                <span className="text-[#999]">→</span>
                                <span className="px-2 py-0.5 rounded-full border border-[#e0e0e0] bg-white text-[#333] text-[11px]">
                                  mobbin
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Target className="size-3.5 text-[#666]" />
                                <span className="text-[#666]">ICP</span>
                                <span className="text-[#999]">→</span>
                                <span className="text-[#16a34a] font-semibold text-[11px]">
                                  ✓ True
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CurrencyDollar className="size-3.5 text-[#666]" />
                                <span className="text-[#666]">ARR</span>
                                <span className="text-[#999]">→</span>
                                <span className="font-semibold text-[#111]">$ 8.5m</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Activity 2: ICP update */}
                      <div className="relative">
                        <div className="absolute -left-6 top-0.5 size-4 rounded-full border border-[#d0d0d0] bg-white flex items-center justify-center text-[#666]">
                          <PencilSimple className="size-2.5" />
                        </div>
                        <div className="flex items-center justify-between text-xs text-[#222]">
                          <div className="flex items-center gap-1 font-medium">
                            <span>You updated</span>
                            <Target className="size-3 text-[#666] ml-1" />
                            <span>ICP</span>
                            <span className="text-[#999]">→</span>
                            <span className="text-[#dc2626] font-semibold text-[11px]">
                              ✕ False
                            </span>
                          </div>
                          <span className="text-[11px] text-[#888]">22 minutes ago</span>
                        </div>
                      </div>

                      {/* Activity 3: Entity Creation */}
                      <div className="relative">
                        <div className="absolute -left-6 top-0.5 size-4 rounded-full border border-[#d0d0d0] bg-white flex items-center justify-center text-[#666]">
                          <Plus className="size-2.5" />
                        </div>
                        <div className="flex items-center justify-between text-xs text-[#222]">
                          <div className="font-medium">
                            <span className="font-semibold">Mobbin</span> was created by You
                          </div>
                          <span className="text-[11px] text-[#888]">27 minutes ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab !== "Timeline" && (
                  <div className="flex flex-col items-center justify-center py-16 text-[#888]">
                    <p className="text-sm font-medium">{activeTab} tab content</p>
                    <p className="text-xs text-[#aaa] mt-1">No items found in this view.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER BAR */}
      <footer className="h-8 bg-[#18181b] text-white px-4 flex items-center justify-between text-xs shrink-0 font-medium">
        <div className="flex items-center gap-2">
          <div className="size-4 rounded bg-white text-black flex items-center justify-center font-bold text-[10px]">
            20
          </div>
          <span className="font-semibold text-xs tracking-tight">Twenty</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-[#a1a1aa]">
          <span>curated by</span>
          <div className="flex items-center gap-1 font-bold text-white">
            <span className="size-3 rounded bg-white text-black flex items-center justify-center text-[8px]">m</span>
            <span>Mobbin</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
