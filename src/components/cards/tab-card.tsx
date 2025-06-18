/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,

  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Separator } from "../ui/separator";


export interface FilterOption {
  key: string; // Property to filter on (e.g., "user_id")
  value: string | null; // Value to match (null for all)
  tabLabel: string; // Optional label for the tab
}

interface TabCardProps {
  items: any[]; // Array of data objects
  cardTitle?: string; // Optional title for the card
  hasSeparators?: boolean; // Optional prop to add separators between picks
  cardDescription?: string; // Optional description for the card
  filterableOptions: FilterOption[]; // Filtering criteria for each tab
  ComponentDiv: React.ComponentType<{ data: any }>; // Component to render picks
}

export default function TabCard({
  items,
  //tabLabels,
  hasSeparators = false,
  cardTitle,
  cardDescription,
  filterableOptions,
  ComponentDiv,
}: TabCardProps) {
  const tabLabels = filterableOptions.map(opt => opt.tabLabel || opt.key);
  const tabValues = tabLabels.map((label: string) => label.toLowerCase());
    const findFirstTabWithItems = () => {
    for (let i = 0; i < tabValues.length; i++) {
      const filterOption = filterableOptions[i];
      const hasItems = items.some(item => 
        filterOption.value === null || item[filterOption.key] === filterOption.value
      );
      if (hasItems) {
        return tabValues[i];
      }
    }
    // If no tabs have items, return the last tab value
    return tabValues[tabValues.length - 1] || "all";
  };

  const initialTab = findFirstTabWithItems();
  const [activeTab, setActiveTab] = useState(initialTab || "all");
 

  // Filter picks for the active tab
  const filteredPicks = items.filter((pick) => {
    const filterOption = filterableOptions.find(
      (opt, index) => tabValues[index] === activeTab
    );
    if (!filterOption) return false;
    return filterOption.value === null || pick[filterOption.key] === filterOption.value;
  });

  return (
    <div className="flex w-full max-w-md flex-col ">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        defaultValue={tabLabels[0]?.toLowerCase() || "all"}
      >
        <TabsList className="grid w-fit translate-y-1" style={{ gridTemplateColumns: `repeat(${tabLabels.length}, 1fr)` }}>
          {tabLabels.map((label) => (
            <TabsTrigger key={label} value={label.toLowerCase()}>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
        <Card>
          <CardHeader className="mb-0 pb-0">
            {tabLabels.map((label) => (
              <TabsContent key={label} value={label.toLowerCase()}>
                <CardTitle className='pb-3'>{cardTitle || ''}</CardTitle>
                <CardDescription className="mb-0 pb-0">
                  {cardDescription || ''}
                </CardDescription>
              </TabsContent>
            ))}
          </CardHeader>
          <CardContent className="grid gap-4 mt-0 pt-0">
            {filteredPicks.length ? (
              filteredPicks.map((data,index:number) => (
                
                            <div key={index} className="flex flex-col justify-between">
                              <ComponentDiv data={data} />
                              {hasSeparators && index !== data.length - 1 &&
                                <Separator orientation="horizontal" className='bg-muted' />
                              }
                            </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No picks available.</p>
            )}
          </CardContent>
          {/* <CardFooter className="flex justify-end">
            <Button type="submit">Refresh</Button>
          </CardFooter> */}
        </Card>
      </Tabs>
    </div>
  );
}

export function TabCardSkeleton() {
  // create 
  return(
    <div className="animate-pulse flex flex-col gap-4 w-full">
      <Card className="w-full">
        <CardHeader className="mb-0 pb-0">
          <div className="h-6 bg-muted rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-muted rounded w-3/4"></div>
        </CardHeader>
        <CardContent className="grid gap-4 mt-0 pt-0">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex flex-col gap-2">
              <div className="h-10 bg-muted rounded w-full"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}