import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { Button } from "./ui/button";
import Icon from "./Icon";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { cn } from "@/lib/utils";
import useLang from "@/hooks/useLang";

function HeaderContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between h-[5.5vh] w-full bg-background-second rounded-t-[0.6vh] px-[1.2vh]",
        className
      )}
    >
      {children}
    </div>
  );
}

function HeaderText({
  text,
  children,
}: {
  text?: string;
  children?: React.ReactNode;
}) {
  return (
    <p className="text-[1.4vh] font-extrabold">
      {text}
      {children}
    </p>
  );
}

function HeaderButton({
  icon,
  onClick,
}: {
  icon: IconProp;
  onClick: () => void;
}) {
  return (
    <Button variant="ghost" onClick={onClick}>
      <Icon icon={icon} />
    </Button>
  );
}

function HeaderSearch({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const { t } = useLang();
  return (
    <InputGroup>
      <InputGroupInput
        placeholder={t("SEARCH_PLACEHOLDER")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <InputGroupAddon>
        <Icon icon="magnifying-glass" />
      </InputGroupAddon>
    </InputGroup>
  );
}

export { HeaderContainer, HeaderText, HeaderButton, HeaderSearch };
