
const Footer = () => {
  return (
    <footer className="border-t bg-gradient-to-r from-background via-emerald-50/40 to-background dark:from-background dark:via-emerald-950/10 dark:to-background">
      <div className="mx-auto flex w-full max-w-[var(--max-width)] flex-col gap-3 px-4 py-5 text-sm lg:flex-row lg:items-center lg:justify-between lg:px-14">
        <div className="space-y-1">
          <p className="font-medium text-foreground">
            Spendly helps you track expenses, understand trends, and stay ahead financially.
          </p>
          <p className="text-muted-foreground">
            Crafted with care by Harshit Jain.
          </p>
        </div>

        <div className="text-muted-foreground lg:text-right">
          <p>&copy; {new Date().getFullYear()} Spendly</p>
          <p className="text-xs">Personal finance dashboard by Harshit Jain</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
