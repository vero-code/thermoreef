export function JudgeTab() {
  return (
    <div className="judge-tab-inner">
      <p className="judge-tab-desc">
        Every click queries live NOAA satellite telemetry (SST, DHW, Alert Level) in real time. Rescue protocols are generated instantly by our local engine using these exact satellite metrics — with 0ms latency and no remote calls to Nebius or Tavily.
      </p>
    </div>
  );
}
