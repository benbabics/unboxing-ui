import { TreoNavigationItem } from "@treo/components/navigation";

export const defaultUiNavigation: TreoNavigationItem[] = [
  {
    id: "apps",
    title: "APPS",
    subtitle: "This is a subtitle",
    type: "group",
    children: [
      {
        id: "apps.brands",
        title: "Brands",
        type: "basic",
        icon: "heroicons_outline:speakerphone",
        link: "/brands"
      },
      {
        id: "apps.projects",
        title: "Projects",
        type: "basic",
        icon: "heroicons_outline:duplicate",
        link: "/projects"
      },
    ]
  },
  {
    id: "root",
    title: "Woof",
    subtitle: "bark bark bark",
    type: "group",
    children: [
      {
        id: "root.settings",
        title: "Settings",
        type: "basic",
        icon: "heroicons_outline:cog",
        link: "/settings"
      }
    ]
  }
];
