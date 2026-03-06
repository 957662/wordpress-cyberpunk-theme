/**
 * 图标组件集合
 * 基于 lucide-react 图标库
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
  Shield,
  Rocket,
} from 'lucide-react';

// 导出所有图标组件
export const MenuIcon = Menu;
export const CloseIcon = X;
export const SearchIcon = Search;
export const ThemeIcon = Sun;
export const GitHubIcon = Github;
export const TwitterIcon = Twitter;
export const HeartIcon = Heart;
export const LoaderIcon = Loader2;

// Logo 组件 - 自定义赛博朋克风格 Logo
export function Logo({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="cyberGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f0ff" />
          <stop offset="100%" stopColor="#9d00ff" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <circle cx="50" cy="50" r="45" stroke="url(#cyberGradient)" strokeWidth="2" />
      <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <path d="M62 35 C58 32 52 32 48 35 C42 39 42 46 48 50 C54 54 54 61 48 65 C42 68 36 64 34 60" stroke="url(#cyberGradient)" strokeWidth="3" strokeLinecap="round" fill="none" filter="url(#glow)" />
      <circle cx="50" cy="5" r="2" fill="#00f0ff" filter="url(#glow)" />
      <circle cx="85" cy="30" r="2" fill="#9d00ff" filter="url(#glow)" />
      <circle cx="85" cy="70" r="2" fill="#ff0080" filter="url(#glow)" />
      <circle cx="50" cy="95" r="2" fill="#00f0ff" filter="url(#glow)" />
      <circle cx="15" cy="70" r="2" fill="#9d00ff" filter="url(#glow)" />
      <circle cx="15" cy="30" r="2" fill="#ff0080" filter="url(#glow)" />
    </svg>
  );
}

export default {
  MenuIcon,
  CloseIcon,
  SearchIcon,
  ThemeIcon,
  GitHubIcon,
  TwitterIcon,
  HeartIcon,
  LoaderIcon,
  Logo,
};
      <path
        d="M35 50 L45 40 L55 40 L65 50 L55 60 L45 60 Z"
        fill="currentColor"
        opacity="0.8"
      />
      <circle cx="50" cy="50" r="8" fill="currentColor" />
      <path d="M30 50 L20 50 M70 50 L80 50" stroke="currentColor" strokeWidth="2" />
      <path d="M50 30 L50 20 M50 70 L50 80" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

// 重新导出所有图标
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
};
