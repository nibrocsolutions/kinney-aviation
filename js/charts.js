(() => {
  const TRADITIONAL = {
    labor: 1850,
    partsMarkup: 420,
    ferryOut: 650,
    ferryBack: 650,
    hangarTransient: 280,
    downtimeDays: 9,
  };

  const KINNEY = {
    labor: 1650,
    partsMarkup: 280,
    ferryOut: 0,
    ferryBack: 180, // reposition / fuel share when needed
    hangarTransient: 90,
    downtimeDays: 4,
  };

  /** Extra annual maintenance burden scales lightly with hours */
  function utilizationFactor(hours) {
    return 0.85 + hours / 500;
  }

  function cycleCosts(hours) {
    const u = utilizationFactor(hours);
    const traditional =
      (TRADITIONAL.labor +
        TRADITIONAL.partsMarkup +
        TRADITIONAL.ferryOut +
        TRADITIONAL.ferryBack +
        TRADITIONAL.hangarTransient) *
      u;
    const kinney =
      (KINNEY.labor +
        KINNEY.partsMarkup +
        KINNEY.ferryOut +
        KINNEY.ferryBack +
        KINNEY.hangarTransient) *
      u;
    return { traditional, kinney, save: traditional - kinney };
  }

  function savingsBreakdown(hours) {
    const u = utilizationFactor(hours);
    return {
      Ferry: (TRADITIONAL.ferryOut + TRADITIONAL.ferryBack - KINNEY.ferryOut - KINNEY.ferryBack) * u,
      "Parts markup": (TRADITIONAL.partsMarkup - KINNEY.partsMarkup) * u,
      Labor: (TRADITIONAL.labor - KINNEY.labor) * u,
      Hangar: (TRADITIONAL.hangarTransient - KINNEY.hangarTransient) * u,
    };
  }

  function fiveYearSeries(hours) {
    const { traditional, kinney } = cycleCosts(hours);
    // Mid-cycle years assume ~55% of a full annual event cost (100-hr / squawks)
    const midT = traditional * 0.55;
    const midK = kinney * 0.55;
    const t = [];
    const k = [];
    let ct = 0;
    let ck = 0;
    for (let y = 1; y <= 5; y++) {
      const isAnnualHeavy = y % 2 === 1;
      ct += isAnnualHeavy ? traditional : midT;
      ck += isAnnualHeavy ? kinney : midK;
      t.push(Math.round(ct));
      k.push(Math.round(ck));
    }
    return { traditional: t, kinney: k };
  }

  const money = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

  const navy = "#0b1f3a";
  const sky = "#5b9fc6";
  const brass = "#c4a35a";
  const muted = "#5a7388";

  Chart.defaults.font.family = '"Barlow", system-ui, sans-serif';
  Chart.defaults.color = muted;

  let chartCycle;
  let chartFive;
  let chartBreak;
  let chartDown;

  function destroy(chart) {
    if (chart) chart.destroy();
  }

  function render(hours) {
    const { traditional, kinney, save } = cycleCosts(hours);
    const five = fiveYearSeries(hours);
    const breakdown = savingsBreakdown(hours);
    const daysSaved = TRADITIONAL.downtimeDays - KINNEY.downtimeDays;

    document.getElementById("summary-save").textContent = money.format(save);
    document.getElementById("summary-five").textContent = money.format(
      five.traditional[4] - five.kinney[4]
    );
    document.getElementById("summary-days").textContent = String(daysSaved);

    destroy(chartCycle);
    chartCycle = new Chart(document.getElementById("chart-cycle"), {
      type: "bar",
      data: {
        labels: ["Traditional shop + ferry", "Kinney Aviation"],
        datasets: [
          {
            label: "Cost per cycle",
            data: [Math.round(traditional), Math.round(kinney)],
            backgroundColor: [sky, brass],
            borderRadius: 3,
            barPercentage: 0.55,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => money.format(ctx.parsed.y),
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (v) => "$" + Number(v).toLocaleString(),
            },
            grid: { color: "rgba(11,31,58,0.06)" },
          },
          x: { grid: { display: false } },
        },
      },
    });

    destroy(chartFive);
    chartFive = new Chart(document.getElementById("chart-five-year"), {
      type: "line",
      data: {
        labels: ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5"],
        datasets: [
          {
            label: "Traditional",
            data: five.traditional,
            borderColor: sky,
            backgroundColor: "rgba(91,159,198,0.15)",
            fill: true,
            tension: 0.28,
            pointRadius: 4,
          },
          {
            label: "Kinney Aviation",
            data: five.kinney,
            borderColor: navy,
            backgroundColor: "rgba(11,31,58,0.08)",
            fill: true,
            tension: 0.28,
            pointRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.dataset.label}: ${money.format(ctx.parsed.y)}`,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (v) => "$" + Number(v).toLocaleString(),
            },
            grid: { color: "rgba(11,31,58,0.06)" },
          },
          x: { grid: { display: false } },
        },
      },
    });

    destroy(chartBreak);
    const breakLabels = Object.keys(breakdown);
    const breakValues = Object.values(breakdown).map((v) => Math.round(v));
    chartBreak = new Chart(document.getElementById("chart-breakdown"), {
      type: "doughnut",
      data: {
        labels: breakLabels,
        datasets: [
          {
            data: breakValues,
            backgroundColor: [navy, sky, brass, "#8fb8c9"],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "bottom" },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.label}: ${money.format(ctx.parsed)}`,
            },
          },
        },
      },
    });

    destroy(chartDown);
    chartDown = new Chart(document.getElementById("chart-downtime"), {
      type: "bar",
      data: {
        labels: ["Traditional", "Kinney Aviation"],
        datasets: [
          {
            label: "Days",
            data: [TRADITIONAL.downtimeDays, KINNEY.downtimeDays],
            backgroundColor: [sky, brass],
            borderRadius: 3,
            barPercentage: 0.55,
          },
        ],
      },
      options: {
        indexAxis: "y",
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.parsed.x} days`,
            },
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: { stepSize: 1 },
            grid: { color: "rgba(11,31,58,0.06)" },
          },
          y: { grid: { display: false } },
        },
      },
    });
  }

  function init() {
    if (typeof Chart === "undefined") return;

    const buttons = document.querySelectorAll(".range-btn");
    let hours = 100;

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        buttons.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        hours = Number(btn.dataset.hours);
        render(hours);
      });
    });

    render(hours);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
