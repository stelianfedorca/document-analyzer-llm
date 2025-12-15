### Folder Structure

```
src/
│
├── app/
│ │
│ ├── (app)/ # App routes (authenticated)
│ │ ├── layout.tsx # → AppShell
│ │ │
│ │ ├── analyze/
│ │ │ ├── upload/
│ │ │ │ └── page.tsx # → <UploadView />
│ │ │ │
│ │ │ ├── report/
│ │ │ │ └── [id]/
│ │ │ │ └── page.tsx # → <ReportView /> | <LoadingState> | <ErrorView(Retry)>
│ │ │ │
│ │ │ └── history/
│ │ │ └── page.tsx # → <HistoryView />
│ │ │
│ │ └── account/
│ │ └── page.tsx
│ │
│ ├── (marketing)/ # Public routes
│ │ ├── layout.tsx # → MarketingShell
│ │ ├── page.tsx # Landing page (/)
│ │ ├── pricing/
│ │ │ └── page.tsx
│ │ └── signin/
│ │ └── page.tsx
│ │
│ ├── api/
│ │ └── analyze/
│ │ └── route.ts
│ │
│ ├── globals.css
│ └── providers.tsx
│
│
├── features/
│ │
│ ├── analyzer/
│ │ ├── components/
│ │ │ ├── UploadView/
│ │ │ │ ├── UploadView.tsx
│ │ │ │ └── UploadView.module.css
│ │ │ │
│ │ │ ├── DropZone/
│ │ │ │ ├── DropZone.tsx
│ │ │ │ └── DropZone.module.css
│ │ │ │
│ │ │ ├── FilePreviewCard/
│ │ │ │ ├── FilePreviewCard.tsx
│ │ │ │ └── FilePreviewCard.module.css
│ │ │ │
│ │ │ ├── ReportView/
│ │ │ │ ├── ReportView.tsx
│ │ │ │ └── ReportView.module.css
│ │ │ │
│ │ │ ├── ResultPanel/
│ │ │ │ ├── ResultPanel.tsx
│ │ │ │ └── ResultPanel.module.css
│ │ │ │
│ │ │ └── ActionSidebar/
│ │ │ ├── ActionSidebar.tsx
│ │ │ └── ActionSidebar.module.css
│ │ │
│ │ ├── hooks/
│ │ │ └── useAnalyzeDocument.ts
│ │ │
│ │ └── types.ts
│ │
│ └── history/
│ ├── components/
│ │ ├── HistoryView/
│ │ │ └── HistoryView.tsx
│ │ └── RecentActivityList/
│ │ ├── RecentActivityList.tsx
│ │ └── RecentActivityList.module.css
│ │
│ └── hooks/
│ └── useHistory.ts
│
│
├── components/
│ │
│ ├── ui/
│ │ ├── Button/
│ │ │ ├── Button.tsx
│ │ │ └── Button.module.css
│ │ ├── Card/
│ │ │ └── Card.tsx
│ │ └── Badge/
│ │ └── Badge.tsx
│ │
│ └── layout/
│ ├── AppShell/
│ │ ├── AppShell.tsx
│ │ └── AppShell.module.css
│ │
│ └── MarketingShell/
│ ├── MarketingShell.tsx
│ └── MarketingShell.module.css
│
│
└── hooks/
└── useMediaQuery.ts
```
