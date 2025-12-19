"use client";

import * as React from "react";
import { Accordion as RadixAccordion } from "radix-ui";
import clsx from "clsx";
import { FiChevronDown } from "react-icons/fi";
import styles from "./Accordion.module.css";

type RootProps = React.ComponentPropsWithoutRef<typeof RadixAccordion.Root>;

type ItemProps = React.ComponentPropsWithoutRef<typeof RadixAccordion.Item>;

type TriggerProps = React.ComponentPropsWithoutRef<
  typeof RadixAccordion.Trigger
> & {
  indicator?: React.ReactNode;
};

type ContentProps = React.ComponentPropsWithoutRef<
  typeof RadixAccordion.Content
> & {
  innerClassName?: string;
};

export function AccordionRoot({ className, ...props }: RootProps) {
  return (
    <RadixAccordion.Root className={clsx(styles.root, className)} {...props} />
  );
}

export function AccordionItem({ className, ...props }: ItemProps) {
  return (
    <RadixAccordion.Item className={clsx(styles.item, className)} {...props} />
  );
}

export function AccordionTrigger({
  className,
  children,
  indicator,
  ...props
}: TriggerProps) {
  return (
    <RadixAccordion.Header className={styles.header}>
      <RadixAccordion.Trigger
        className={clsx(styles.trigger, className)}
        {...props}
      >
        <span className={styles.triggerText}>{children}</span>
        <span className={styles.chevron} aria-hidden>
          {indicator ?? <FiChevronDown />}
        </span>
      </RadixAccordion.Trigger>
    </RadixAccordion.Header>
  );
}

export function AccordionContent({
  className,
  innerClassName,
  children,
  ...props
}: ContentProps) {
  return (
    <RadixAccordion.Content
      className={clsx(styles.content, className)}
      {...props}
    >
      <div className={clsx(styles.contentInner, innerClassName)}>
        {children}
      </div>
    </RadixAccordion.Content>
  );
}
