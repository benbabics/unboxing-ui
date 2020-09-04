import { TreoNavigationItem } from "@treo/components/navigation";

export const settingsNavigation: TreoNavigationItem[] = [
  {
    title: "Settings",
    type:  "group",
    children: [
      {
        title: "General",
        type:  "collapsable",
        icon:  "settings",
        children: [
          {
            title: "User Interface",
            type:  "basic",
            link:  "/settings/ui",
          },
        ]
      },
      {
        title: "Account",
        type:  "collapsable",
        icon:  "account_circle",
        children: [
          {
            title: "Personal",
            type:  "basic"
          },
          {
            title: "Payment",
            type:  "basic"
          },
        ]
      }
    ]
  },
  {
    type: "divider"
  }
];
