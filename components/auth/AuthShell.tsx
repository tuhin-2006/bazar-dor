interface AuthShellProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: AuthShellProps) {
  return (
    <div className="flex flex-1 flex-col bg-[#f5f8f4]">
      <div className="shell flex flex-1 flex-col py-10 sm:py-12">
        <div className="mx-auto w-full max-w-[400px]">
          <div className="text-center">
            <h1 className="font-display text-[1.4rem] font-bold leading-tight tracking-tight text-ink sm:text-[1.6rem]">
              {title}
            </h1>
            <p className="mx-auto mt-2 max-w-[340px] text-[12px] leading-6 text-muted sm:text-[12.5px]">
              {subtitle}
            </p>
          </div>

          <div className="mt-6 rounded-xl border border-line bg-white p-4 shadow-card sm:p-5">
            {children}
          </div>

          {footer ? (
            <div className="mt-6 text-center">{footer}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
