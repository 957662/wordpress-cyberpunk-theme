/**
 * 统一的图标导出文件
 * 修复导出冲突问题
 */

import {
  Menu,
  X,
  Search,
  Sun,
  Moon,
  Github,
  Twitter,
  Heart,
  Loader2,
  Cpu,
  Zap,
  Home,
  BookOpen,
  Briefcase,
  User,
  Calendar,
  Clock,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Mail,
  Settings,
  LogOut,
  LogIn,
  Plus,
  Edit,
  Trash2,
  Save,
  RefreshCw,
  Filter,
  SortAsc,
  SortDesc,
  Eye,
  EyeOff,
  Check,
  XCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  Star,
  StarHalf,
  Tag,
  Folder,
  FileText,
  Image,
  Video,
  Music,
  Code,
  Terminal,
  Database,
  Server,
  Cloud,
  Shield,
  Lock,
  Unlock,
  Wifi,
  Bluetooth,
  Battery,
  BatteryCharging,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Share2,
  Download,
  Upload,
  Link,
  Link2,
  Copy,
  Scissors,
  Clipboard,
  Bell,
  MessageSquare,
  MoreHorizontal,
  Grid,
  List,
  Maximize2,
  Minimize2,
  Globe,
  Linkedin,
  Instagram,
  Youtube,
  Coffee,
} from 'lucide-react';

// 导出所有图标组件 - 使用别名避免冲突
export const MenuIcon = Menu;
export const CloseIcon = X;
export const SearchIcon = Search;
export const SunIcon = Sun;
export const MoonIcon = Moon;
export const GitHubIcon = Github;
export const TwitterIcon = Twitter;
export const HeartIcon = Heart;
export const LoaderIcon = Loader2;
export const CpuIcon = Cpu;
export const ZapIcon = Zap;
export const HomeIcon = Home;
export const BookOpenIcon = BookOpen;
export const BriefcaseIcon = Briefcase;
export const UserIcon = User;
export const CalendarIcon = Calendar;
export const ClockIcon = Clock;
export const ArrowRightIcon = ArrowRight;
export const ChevronDownIcon = ChevronDown;
export const ChevronUpIcon = ChevronUp;
export const ChevronLeftIcon = ChevronLeft;
export const ChevronRightIcon = ChevronRight;
export const ExternalLinkIcon = ExternalLink;
export const MailIcon = Mail;
export const EmailIcon = Mail;
export const SettingsIcon = Settings;
export const LogOutIcon = LogOut;
export const LogInIcon = LogIn;
export const PlusIcon = Plus;
export const EditIcon = Edit;
export const TrashIcon = Trash2;
export const SaveIcon = Save;
export const RefreshIcon = RefreshCw;
export const FilterIcon = Filter;
export const SortAscIcon = SortAsc;
export const SortDescIcon = SortDesc;
export const EyeIcon = Eye;
export const EyeOffIcon = EyeOff;
export const CheckIcon = Check;
export const XCircleIcon = XCircle;
export const AlertCircleIcon = AlertCircle;
export const WarningIcon = AlertTriangle;
export const InfoIcon = Info;
export const StarIcon = Star;
export const StarHalfIcon = StarHalf;
export const TagIcon = Tag;
export const FolderIcon = Folder;
export const FileIcon = FileText;
export const FileTextIcon = FileText;
export const ImageIcon = Image;
export const VideoIcon = Video;
export const MusicIcon = Music;
export const CodeIcon = Code;
export const TerminalIcon = Terminal;
export const DatabaseIcon = Database;
export const ServerIcon = Server;
export const CloudIcon = Cloud;
export const ShieldIcon = Shield;
export const LockIcon = Lock;
export const UnlockIcon = Unlock;
export const WifiIcon = Wifi;
export const BluetoothIcon = Bluetooth;
export const BatteryIcon = Battery;
export const BatteryChargingIcon = BatteryCharging;
export const Volume2Icon = Volume2;
export const VolumeXIcon = VolumeX;
export const MicIcon = Mic;
export const MicOffIcon = MicOff;
export const CameraIcon = Camera;
export const CameraOffIcon = CameraOff;
export const ShareIcon = Share2;
export const DownloadIcon = Download;
export const UploadIcon = Upload;
export const LinkIcon = Link;
export const Link2Icon = Link2;
export const CopyIcon = Copy;
export const ScissorsIcon = Scissors;
export const ClipboardIcon = Clipboard;
export const BellIcon = Bell;
export const MessageSquareIcon = MessageSquare;
export const MoreHorizontalIcon = MoreHorizontal;
export const GridIcon = Grid;
export const ListIcon = List;
export const Maximize2Icon = Maximize2;
export const Minimize2Icon = Minimize2;
export const GlobeIcon = Globe;
export const LinkedInIcon = Linkedin;
export const InstagramIcon = Instagram;
export const YouTubeIcon = Youtube;
export const CoffeeIcon = Coffee;

// Logo 组件 - 自定义赛博朋克风格 Logo
export function Logo({ className = '', size = 24 }: { className?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 外圈 */}
      <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" />
      <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="1" opacity="0.6" />

      {/* 赛博核心 */}
      <path
        d="M35 50 L45 40 L55 40 L65 50 L55 60 L45 60 Z"
        fill="currentColor"
        opacity="0.8"
      />
      <circle cx="50" cy="50" r="8" fill="currentColor" />

      {/* 能量线 */}
      <path d="M30 50 L20 50 M70 50 L80 50" stroke="currentColor" strokeWidth="2" />
      <path d="M50 30 L50 20 M50 70 L50 80" stroke="currentColor" strokeWidth="2" />

      {/* 发光点 */}
      <circle cx="20" cy="50" r="2" fill="currentColor" opacity="0.5" />
      <circle cx="80" cy="50" r="2" fill="currentColor" opacity="0.5" />
      <circle cx="50" cy="20" r="2" fill="currentColor" opacity="0.5" />
      <circle cx="50" cy="80" r="2" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

// ThemeIcon 切换组件
export function ThemeIcon({ className = '', size = 24 }: { className?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
      <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

// 重新导出所有原始图标（按需使用）
export {
  Menu,
  X,
  Search,
  Sun,
  Moon,
  Github,
  Twitter,
  Heart,
  Loader2,
  Cpu,
  Zap,
  Home,
  BookOpen,
  Briefcase,
  User,
  Calendar,
  Clock,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Mail,
  Settings,
  LogOut,
  LogIn,
  Plus,
  Edit,
  Trash2,
  Save,
  RefreshCw,
  Filter,
  SortAsc,
  SortDesc,
  Eye,
  EyeOff,
  Check,
  XCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  Star,
  StarHalf,
  Tag,
  Folder,
  FileText,
  Image,
  Video,
  Music,
  Code,
  Terminal,
  Database,
  Server,
  Cloud,
  Shield,
  Lock,
  Unlock,
  Wifi,
  Bluetooth,
  Battery,
  BatteryCharging,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Share2,
  Download,
  Upload,
  Link,
  Link2,
  Copy,
  Scissors,
  Clipboard,
  Bell,
  MessageSquare,
  MoreHorizontal,
  Grid,
  List,
  Maximize2,
  Minimize2,
  Globe,
  Linkedin,
  Instagram,
  Youtube,
  Coffee,
};

// 导出类型
export type IconProps = {
  className?: string;
  size?: number;
  strokeWidth?: number;
};
