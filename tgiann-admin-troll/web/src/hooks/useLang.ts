import { useAppSelector } from "@/app/hooks";
import type { Lang } from "@/types/main";

function useLang() {
  const lang = useAppSelector((state) => state.lang);

  const t = (key: keyof Lang) => {
    return lang[key] || key;
  };

  return { t, lang };
}

export default useLang;
