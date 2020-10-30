import { UiNavigationItem } from '@libCommon';

export const defaultUiNavigation: UiNavigationItem[] = [
  {
    id: "apps",
    title: "APPS",
    subtitle: "This is a subtitle",
    type: "group",
    children: [
      {
        id: "app.brand",
        title: "Brands",
        type: "collapsable",
        icon: "heroicons_outline:speakerphone",
        link: "/brands",
        children: [
          {
            id: "app.brand.index",
            title: "List",
            type: "basic",
            link: "/brands",
            exactMatch: true,
          },
          {
            id: "app.brand.new",
            title: "New",
            type: "basic",
            link: "/brands/new",
          }
        ]
      },
      {
        id: "app.project",
        title: "Projects",
        type: "collapsable",
        icon: "heroicons_outline:briefcase",
        link: "/projects",
        children: [
          {
            id: "app.project.index",
            title: "List",
            type: "basic",
            link: "/projects",
            exactMatch: true,
          },
          {
            id: "app.project.new",
            title: "New",
            type: "basic",
            link: "/projects/new",
          }
        ]
      },
    ]
  },
  {
    type: "spacer"
  },
  {
    id: "root.settings",
    title: "Settings",
    type: "basic",
    icon: "heroicons_outline:cog",
    link: "/settings"
  }
];
