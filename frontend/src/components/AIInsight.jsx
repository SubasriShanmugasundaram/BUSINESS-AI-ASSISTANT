import React from 'react';
import { BotIcon } from './Icons';

export default function AIInsight({
  title = "AI BUSINESS INSIGHT",
  insight = "Rice demand has increased over the last three weeks. Current inventory may not cover the expected demand.",
  source = "Generated from your live business data & consumption velocity",
  primaryActionLabel = "View analysis",
  onPrimaryAction,
  secondaryActionLabel = "Purchase recommendation",
  onSecondaryAction
}) {
  return (
    <section className="ai-insight-banner" aria-label="AI Business Intelligence Insight">
      <div className="ai-insight-header">
        <div className="ai-insight-tag">
          <BotIcon size={16} />
          <span>{title}</span>
        </div>
        <span className="ai-insight-source">{source}</span>
      </div>

      <div className="ai-insight-text">
        “{insight}”
      </div>

      <div className="ai-insight-actions">
        {primaryActionLabel && onPrimaryAction && (
          <button
            type="button"
            className="btn btn-sm btn-primary"
            onClick={onPrimaryAction}
          >
            <span>{primaryActionLabel}</span>
            <span aria-hidden="true">→</span>
          </button>
        )}

        {secondaryActionLabel && onSecondaryAction && (
          <button
            type="button"
            className="btn btn-sm btn-secondary"
            onClick={onSecondaryAction}
          >
            <span>{secondaryActionLabel}</span>
            <span aria-hidden="true">→</span>
          </button>
        )}
      </div>
    </section>
  );
}
