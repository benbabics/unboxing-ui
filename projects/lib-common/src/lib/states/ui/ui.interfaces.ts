export interface UiNavigationItem {
  id?: string;
  title?: string;
  subtitle?: string;
  type: 'aside' | 'basic' | 'collapsable' | 'divider' | 'group' | 'spacer';
  hidden?: (item: UiNavigationItem) => boolean;
  active?: boolean;
  disabled?: boolean;
  link?: string;
  externalLink?: boolean;
  exactMatch?: boolean;
  function?: (item: UiNavigationItem) => void;
  classes?: string;
  icon?: string;
  iconClasses?: string;
  badge?: {
    title?: string;
    style?: 'rectangle' | 'rounded' | 'simple',
    background?: string;
    color?: string;
  };
  children?: UiNavigationItem[];
  meta?: any;
}
