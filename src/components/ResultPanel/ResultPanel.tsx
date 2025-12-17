import styles from "./ResultPanel.module.css";
import clsx from "clsx";
import { DocumentRecord } from "@/types/firestore";
import { LuCircleCheckBig } from "react-icons/lu";
import {
  AccordionContent,
  AccordionItem,
  AccordionRoot,
  AccordionTrigger,
} from "@/components/ui/Accordion";

interface Props {
  data: DocumentRecord;
}

function formatDocType(docType?: string) {
  if (!docType) return "Unknown";

  return docType.charAt(0).toUpperCase() + docType.slice(1);
}

export function ResultPanel({ data }: Props) {
  return (
    <section className={clsx(styles.container)}>
      <header className={styles.header}>
        <h2 className={styles.title}>{data.analysis?.title || "Summary"}</h2>
        <span className={styles.docType}>
          {formatDocType(data.analysis?.documentType)}
        </span>
      </header>
      <AccordionRoot
        type="multiple"
        className={styles.accordion}
        defaultValue={["main-points", "overall-summary"]}
      >
        <AccordionItem value="main-points" className={styles.accordionItem}>
          <AccordionTrigger className={styles.accordionTrigger}>
            <h3 className={styles.sectionTitle}>Key Findings</h3>
          </AccordionTrigger>
          <AccordionContent
            className={styles.accordionContent}
            innerClassName={styles.contentSectionInner}
          >
            <ul className={clsx(styles.mainPointsList)}>
              {data.analysis?.mainPoints.map((point, index) => {
                return (
                  <li key={index} className={styles.mainPointItem}>
                    <LuCircleCheckBig
                      className={styles.mainPointIcon}
                      aria-hidden="true"
                    />
                    <p>{point}</p>
                  </li>
                );
              })}
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="overall-summary" className={styles.accordionItem}>
          <AccordionTrigger className={styles.accordionTrigger}>
            <h3 className={styles.sectionTitle}>Overview</h3>
          </AccordionTrigger>
          <AccordionContent
            className={styles.accordionContent}
            innerClassName={styles.contentSectionInner}
          >
            <div className={clsx(styles.summary)}>
              {data.analysis?.overallSummary.map(
                (paragraph, idx) =>
                  paragraph.trim() && (
                    <p key={idx} className={styles.paragraph}>
                      {paragraph}
                    </p>
                  )
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </AccordionRoot>
    </section>
  );
}

[
  "This document is a service supply contract between Fedorca Stelian and Digi Romania SA, dated November 28, 2025. It details the provision of Digi TV Cablu (Digital package) and Digi Net (FiberLink 1000) services for a minimum period of 12 months. The Beneficiary benefits from a 100% reduction on installation/activation fees and monthly equipment rental for the TV service.\nKey terms include the Beneficiary's declaration of no prior outstanding debts, agreement to use services within Romania, and responsibility for parental control activation. The contract also outlines Digi Romania's personal data processing practices, including data categories, purposes, legal bases, storage durations, and the Beneficiary's rights under GDPR, with full terms available on Digi Romania's website.",
];
