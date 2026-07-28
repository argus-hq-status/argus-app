import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { v as s$1, y as s } from "../_libs/phosphor-icons__react.mjs";
import { v as useParams } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as api } from "./api-BjYsLp3o.mjs";
import { t as NumberFlow } from "../_libs/number-flow+number-flow__react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/status._slug-B7xUOFVW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function easeOutCubic(t) {
	return 1 - Math.pow(1 - t, 3);
}
function useAnimateNumber(options) {
	const [value, setValue] = (0, import_react.useState)(options.start ?? 0);
	const frameRef = (0, import_react.useRef)(0);
	const optionsRef = (0, import_react.useRef)(options);
	optionsRef.current = options;
	return {
		value,
		start: (0, import_react.useCallback)(() => {
			const { start: from, end: to, duration = 1e3, onComplete } = optionsRef.current;
			const startedAt = performance.now();
			function tick(now) {
				const elapsed = now - startedAt;
				const progress = Math.min(elapsed / duration, 1);
				setValue((from ?? 0) + ((to ?? 0) - (from ?? 0)) * easeOutCubic(progress));
				if (progress < 1) frameRef.current = requestAnimationFrame(tick);
				else onComplete?.();
			}
			cancelAnimationFrame(frameRef.current);
			frameRef.current = requestAnimationFrame(tick);
		}, []),
		reset: (0, import_react.useCallback)(() => {
			cancelAnimationFrame(frameRef.current);
			setValue(optionsRef.current.start ?? 0);
		}, [])
	};
}
var DOT_COLORS = {
	up: "bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]",
	down: "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.5)]",
	unknown: "bg-orange-400"
};
var CHECK_COLORS = {
	up: "bg-green-400",
	down: "bg-red-400"
};
function MonitorCard({ name, url, status, avgPct, daysTracked, dailyHealth }) {
	const [dayIndex, setDayIndex] = (0, import_react.useState)(() => Math.max(0, dailyHealth.length - 1));
	const initialRef = (0, import_react.useRef)(true);
	const prevValueRef = (0, import_react.useRef)(0);
	const activeDay = dailyHealth[dayIndex] ?? dailyHealth[0];
	const animateNumber = useAnimateNumber({
		start: prevValueRef.current,
		end: activeDay?.successRate ?? 0,
		duration: initialRef.current ? 1250 : 300,
		onComplete: () => {
			prevValueRef.current = activeDay?.successRate ?? 0;
			initialRef.current = false;
		}
	});
	(0, import_react.useEffect)(() => {
		if (activeDay) animateNumber.start();
		else animateNumber.reset();
	}, [activeDay]);
	const pctColor = (activeDay?.successRate ?? 0) >= 99 ? "text-green-600" : (activeDay?.successRate ?? 0) >= 95 ? "text-yellow-600" : (activeDay?.successRate ?? 0) >= 80 ? "text-orange-600" : "text-red-600";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `size-2.5 shrink-0 rounded-full ${DOT_COLORS[status] ?? DOT_COLORS.unknown}` }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-base font-semibold text-gray-900",
								children: name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${status === "up" ? "bg-green-50 text-green-700" : status === "down" ? "bg-red-50 text-red-700" : "bg-orange-50 text-orange-700"}`,
								children: status === "up" ? "Operational" : status === "down" ? "Degraded" : "Pending"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 break-all text-sm text-gray-400",
						children: url
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-right",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-gray-400",
						children: [daysTracked, " days tracked"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-lg font-bold text-gray-900",
						children: [avgPct, "% avg"]
					})]
				})]
			}),
			activeDay && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 rounded-xl border border-gray-100 bg-gray-50 p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-start justify-between gap-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-medium text-gray-500",
								children: "Daily Checks"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `text-xl font-bold tabular-nums ${pctColor}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumberFlow, {
									value: animateNumber.value,
									suffix: "%"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-gray-400",
								children: [
									activeDay.successCount,
									"/",
									activeDay.total,
									" up"
								]
							})]
						})] })
					}),
					activeDay.checks.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 flex gap-0.5 overflow-hidden rounded-md",
						children: activeDay.checks.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `h-8 flex-1 ${CHECK_COLORS[c] ?? "bg-gray-200"}`,
							title: `Check ${i + 1}: ${c}`
						}, i))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-medium text-gray-600",
								children: activeDay.label
							}), dailyHealth.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setDayIndex((i) => i === 0 ? dailyHealth.length - 1 : i - 1),
									className: "flex size-5 items-center justify-center rounded-l-md bg-white ring-1 ring-inset ring-gray-200 transition hover:bg-gray-50 focus:outline-none",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s, {
										className: "size-[18px] text-gray-500",
										weight: "bold"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setDayIndex((i) => i === dailyHealth.length - 1 ? 0 : i + 1),
									className: "flex size-5 items-center justify-center rounded-r-md bg-white ring-1 ring-inset ring-gray-200 transition hover:bg-gray-50 focus:outline-none",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s$1, {
										className: "size-[18px] text-gray-500",
										weight: "bold"
									})
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-xs text-gray-400",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-sm bg-green-400" }), activeDay.successCount]
							}), activeDay.failedCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-sm bg-red-400" }), activeDay.failedCount]
							})]
						})]
					})
				]
			}),
			dailyHealth.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex items-center gap-1.5",
				children: dailyHealth.map((day, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setDayIndex(i),
					className: `h-1.5 rounded-full transition-all ${i === dayIndex ? "w-5 bg-gray-600" : "w-1.5 bg-gray-200 hover:bg-gray-300"}`,
					"aria-label": day.label
				}, day.key))
			})
		]
	});
}
function IncidentUpdates({ updates }) {
	const [showAll, setShowAll] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [(showAll ? updates : updates.slice(0, 3)).map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `mt-1.5 inline-block size-2 shrink-0 rounded-full ${u.status === "resolved" ? "bg-green-500" : u.status === "investigating" ? "bg-orange-500" : u.status === "identified" ? "bg-blue-500" : "bg-gray-400"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 flex-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-gray-700",
				children: u.message
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-0.5 text-xs text-gray-400",
				children: new Date(u.createdAt).toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
					hour: "numeric",
					minute: "2-digit"
				})
			})]
		})]
	}, u.id)), updates.length > 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick: () => setShowAll((prev) => !prev),
		className: "pl-5 text-xs text-gray-400 hover:text-gray-600 transition-colors",
		children: showAll ? "Show less" : `+${updates.length - 3} more updates`
	})] });
}
var DAYS_TO_SHOW = 30;
function getDayKey(date) {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function formatDayLabel(date) {
	return new Intl.DateTimeFormat("en-US", {
		weekday: "short",
		month: "short",
		day: "numeric"
	}).format(date);
}
function buildDailyHealth(checks) {
	const today = /* @__PURE__ */ new Date();
	today.setHours(0, 0, 0, 0);
	const dayBuckets = /* @__PURE__ */ new Map();
	for (const check of checks) {
		const checkedAt = new Date(check.checkedAt);
		const key = getDayKey(checkedAt);
		const bucket = dayBuckets.get(key) ?? [];
		bucket.push({
			...check,
			checkedAt
		});
		dayBuckets.set(key, bucket);
	}
	return Array.from({ length: DAYS_TO_SHOW }, (_, index) => {
		const date = new Date(today);
		date.setDate(today.getDate() - (DAYS_TO_SHOW - 1 - index));
		const key = getDayKey(date);
		const dayChecks = dayBuckets.get(key) ?? [];
		const successCount = dayChecks.filter((c) => c.status === "up").length;
		const failedCount = dayChecks.filter((c) => c.status === "down").length;
		const total = dayChecks.length;
		const successRate = total > 0 ? Math.round(successCount / total * 100) : 0;
		return {
			key,
			date,
			label: formatDayLabel(date),
			total,
			successCount,
			failedCount,
			successRate,
			isComplete: total > 0,
			checks: dayChecks.map((c) => c.status)
		};
	});
}
function PublicStatusPage() {
	const { slug } = useParams({ from: "/status/$slug" });
	const [data, setData] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		api(`/api/public/status/${slug}`).then((r) => {
			if (!r.ok) throw new Error();
			return r.json();
		}).then((d) => {
			setData(d);
			setLoading(false);
		}).catch(() => {
			setError(true);
			setLoading(false);
		});
	}, [slug]);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-gray-50 flex items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-gray-400",
			children: "Loading..."
		})
	});
	if (error || !data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-gray-50 flex items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-gray-400",
			children: "Status page not found."
		})
	});
	const { page, monitors, checks, incidents, incidentUpdates: incidentUpdatesMap } = data;
	const monitorsList = monitors ?? [];
	const checksList = checks ?? [];
	const incidentsList = incidents ?? [];
	const updatesMap = incidentUpdatesMap ?? {};
	const dailyHealthByMonitor = /* @__PURE__ */ new Map();
	for (const monitor of monitorsList) {
		const monitorChecks = checksList.filter((c) => c.monitorId === monitor.id);
		dailyHealthByMonitor.set(monitor.id, buildDailyHealth(monitorChecks));
	}
	const allHealthy = monitorsList.every((m) => m.currentStatus === "up");
	const activeIncidents = incidentsList.filter((inc) => inc.status !== "resolved");
	const BORDER_COLORS = {
		investigating: "border-l-red-500",
		identified: "border-l-amber-500"
	};
	const BG_COLORS = {
		investigating: "bg-red-50",
		identified: "bg-amber-50"
	};
	const TEXT_COLORS = {
		investigating: "text-red-700",
		identified: "text-amber-700"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-gray-50",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: page.logoUrl || "/images/logo.svg",
									alt: "",
									className: "mb-5 h-10 rounded-xl"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl",
									children: page.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1.5 text-sm text-gray-500",
									children: "Current status of all monitored services."
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OverallStatusBadge, { status: allHealthy ? "up" : "down" })]
					})
				}),
				activeIncidents.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 space-y-3",
					children: activeIncidents.map((inc) => {
						const updates = updatesMap[inc.id] ?? [];
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `rounded-xl border border-l-4 ${BORDER_COLORS[inc.status] ?? "border-l-red-500"} border-gray-200 bg-white p-5 shadow-sm`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full ${BG_COLORS[inc.status] ?? "bg-red-50"}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `text-sm font-bold ${TEXT_COLORS[inc.status] ?? "text-red-700"}`,
										children: "!"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold text-gray-900",
												children: inc.title
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `inline-flex items-center rounded-full ${BG_COLORS[inc.status] ?? "bg-red-50"} px-2 py-0.5 text-xs font-medium ${TEXT_COLORS[inc.status] ?? "text-red-700"}`,
												children: inc.status
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-sm text-gray-500",
											children: new Date(inc.startedAt).toLocaleDateString("en-US", {
												month: "short",
												day: "numeric",
												year: "numeric",
												hour: "numeric",
												minute: "2-digit"
											})
										}),
										updates.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-2 text-sm text-gray-700",
											children: updates[0].message
										})
									]
								})]
							})
						}, inc.id);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-semibold text-gray-900",
						children: "Services"
					}), monitorsList.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 rounded-xl border border-dashed border-gray-200 bg-white px-4 py-8 text-center text-sm text-gray-400",
						children: "No monitors configured for this page."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 space-y-4",
						children: monitorsList.map((monitor) => {
							const daysWithData = (dailyHealthByMonitor.get(monitor.id) ?? []).filter((d) => d.isComplete);
							const avgUptime = daysWithData.reduce((sum, d) => sum + d.successRate, 0);
							const avgPct = daysWithData.length > 0 ? Math.round(avgUptime / daysWithData.length) : 0;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonitorCard, {
								name: monitor.name,
								url: monitor.url,
								status: monitor.currentStatus,
								avgPct,
								daysTracked: daysWithData.length,
								dailyHealth: daysWithData
							}, monitor.id);
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-semibold text-gray-900",
						children: "Incident History"
					}), incidentsList.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 rounded-xl border border-dashed border-gray-200 bg-white px-4 py-8 text-center text-sm text-gray-400",
						children: "No incidents reported in the last 30 days."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 space-y-3",
						children: incidentsList.map((inc) => {
							const updates = updatesMap[inc.id] ?? [];
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-gray-200 bg-white p-5 shadow-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-center gap-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `inline-block size-2 shrink-0 rounded-full ${inc.status === "resolved" ? "bg-green-500" : inc.status === "investigating" ? "bg-orange-500" : inc.status === "identified" ? "bg-blue-500" : "bg-gray-400"}` }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-medium text-gray-900",
													children: inc.title
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${inc.status === "resolved" ? "bg-green-50 text-green-700" : inc.status === "investigating" ? "bg-orange-50 text-orange-700" : inc.status === "identified" ? "bg-blue-50 text-blue-700" : "bg-gray-50 text-gray-600"}`,
													children: inc.status
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-1 text-sm text-gray-400",
											children: [new Date(inc.startedAt).toLocaleDateString("en-US", {
												month: "short",
												day: "numeric",
												year: "numeric"
											}), inc.resolvedAt && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [" → ", new Date(inc.resolvedAt).toLocaleDateString("en-US", {
												month: "short",
												day: "numeric",
												year: "numeric"
											})] })]
										})]
									})
								}), updates.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-4 space-y-3 border-t border-gray-100 pt-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IncidentUpdates, { updates })
								})]
							}, inc.id);
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubscribeSection, { statusPageId: page.id })
			]
		})
	});
}
function OverallStatusBadge({ status }) {
	if (status === "up") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-1.5 text-sm font-semibold text-green-700 ring-1 ring-green-200",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]" }), "All Operational"]
	});
	if (status === "down") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-1.5 text-sm font-semibold text-red-700 ring-1 ring-red-200",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.5)]" }), "Degraded Performance"]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-1.5 text-sm font-semibold text-orange-700 ring-1 ring-orange-200",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-orange-400" }), "Pending Checks"]
	});
}
function SubscribeSection({ statusPageId }) {
	const [email, setEmail] = (0, import_react.useState)("");
	const [message, setMessage] = (0, import_react.useState)("");
	const [subscribed, setSubscribed] = (0, import_react.useState)(false);
	async function handleSubmit(e) {
		e.preventDefault();
		setMessage("");
		const res = await api(`/api/public/status/${statusPageId}/subscribe`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email })
		});
		const data = await res.json();
		if (res.ok) {
			setSubscribed(true);
			setEmail("");
			setMessage("You're subscribed!");
		} else setMessage(data.message ?? "Something went wrong.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-base font-semibold text-gray-900",
				children: "Get notified"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-gray-500",
				children: "Receive email updates when service status changes."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children: subscribed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium text-green-600",
					children: "You're subscribed! We'll notify you of any status changes."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSubmit,
					className: "flex flex-col gap-3 sm:flex-row sm:items-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "email",
							value: email,
							onChange: (e) => setEmail(e.target.value),
							placeholder: "you@example.com",
							required: true,
							className: "h-10 flex-1 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-300 focus:ring-2 focus:ring-gray-200"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							className: "inline-flex h-10 items-center justify-center rounded-lg bg-gray-900 px-4 text-sm font-semibold text-white transition hover:bg-gray-800",
							children: "Subscribe"
						}),
						message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-gray-500 sm:ml-2",
							children: message
						})
					]
				})
			})
		]
	});
}
//#endregion
export { PublicStatusPage as component };
