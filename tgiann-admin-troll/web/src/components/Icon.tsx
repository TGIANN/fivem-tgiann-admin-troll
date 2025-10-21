import {
  FontAwesomeIcon,
  type FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";

export default function Icon(props: FontAwesomeIconProps) {
  return <FontAwesomeIcon {...props} widthAuto />;
}
