import { useAppSelector } from "@/app/hooks";
import { changeAppPage, setIsOpen } from "@/features/main";
import { fetchNui } from "@/lib/fetchNui";
import type { CurrentAppPage } from "@/types/main";
import { useDispatch } from "react-redux";

export default function useApp() {
  const dispatch = useDispatch();
  const isOpen = useAppSelector((state) => state.main.isOpen);
  const currentAppPage = useAppSelector((state) => state.main.currentAppPage);

  const closeApp = () => {
    dispatch(setIsOpen(false));
    fetchNui("close");
  };

  const openApp = () => {
    dispatch(setIsOpen(true));
  };

  const changePage = (page: CurrentAppPage) => {
    dispatch(changeAppPage(page));
  };

  return { closeApp, openApp, changePage, currentAppPage, isOpen };
}
