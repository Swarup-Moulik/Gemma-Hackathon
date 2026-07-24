import React from "react";

function FeatureCard({
  number,
  title,
  description,
  icon: Icon,
  badgeText,
  badgeColor = "text-primary",
}) {
  return (
    <div className="leaf-glass-card p-6 sm:p-7 flex flex-col justify-between min-h-[260px] h-full">
      <div className="space-y-2">
        <span className="text-4xl font-extrabold text-foreground/40 font-editorial block leading-none">
          {number}
        </span>
        <h4 className="text-xl font-bold text-foreground font-editorial">
          {title}
        </h4>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>

      <div
        className={`flex items-center gap-2 text-xs font-semibold ${badgeColor} pt-6 mt-auto`}
      >
        <Icon className="w-4 h-4 shrink-0" />
        <span>{badgeText}</span>
      </div>
    </div>
  );
}

export default FeatureCard;
