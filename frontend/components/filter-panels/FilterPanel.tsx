/**
 * Filter Panel Component
 *
 * Collapsible filter panel for list views
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Filter,
  ChevronDown,
  ChevronUp,
  X,
  RotateCcw,
} from 'lucide-react';

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

export interface FilterGroup {
  id: string;
  label: string;
  type: 'checkbox' | 'radio' | 'range' | 'select' | 'date' | 'text';
  options?: FilterOption[];
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}

export interface FilterState {
  [key: string]: any;
}

interface FilterPanelProps {
  groups: FilterGroup[];
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset?: () => void;
  defaultOpen?: boolean;
  showCounts?: boolean;
  collapsible?: boolean;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  groups,
  filters,
  onChange,
  onReset,
  defaultOpen = true,
  showCounts = true,
  collapsible = true,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleFilterChange = (groupId: string, value: any) => {
    onChange({
      ...filters,
      [groupId]: value,
    });
  };

  const handleCheckboxChange = (groupId: string, optionValue: string, checked: boolean) => {
    const currentValues = filters[groupId] || [];
    const newValues = checked
      ? [...currentValues, optionValue]
      : currentValues.filter((v: string) => v !== optionValue);
    handleFilterChange(groupId, newValues);
  };

  const handleReset = () => {
    const resetFilters: FilterState = {};
    groups.forEach((group) => {
      if (group.type === 'range') {
        resetFilters[group.id] = [group.min || 0, group.max || 100];
      } else {
        resetFilters[group.id] = group.type === 'checkbox' ? [] : '';
      }
    });
    onChange(resetFilters);
    onReset?.();
  };

  const activeFilterCount = Object.values(filters).filter(
    (v) => v && (Array.isArray(v) ? v.length > 0 : true)
  ).length;

  const renderFilterGroup = (group: FilterGroup) => {
    const value = filters[group.id];

    switch (group.type) {
      case 'checkbox':
        return (
          <div key={group.id} className="space-y-3">
            <h4 className="font-medium text-sm">{group.label}</h4>
            <div className="space-y-2">
              {group.options?.map((option) => {
                const isChecked = Array.isArray(value) && value.includes(option.value);
                return (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${group.id}-${option.value}`}
                      checked={isChecked}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(group.id, option.value, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={`${group.id}-${option.value}`}
                      className="flex-1 cursor-pointer text-sm font-normal"
                    >
                      {option.label}
                    </Label>
                    {showCounts && option.count !== undefined && (
                      <Badge variant="outline" className="text-xs">
                        {option.count}
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'radio':
        return (
          <div key={group.id} className="space-y-3">
            <h4 className="font-medium text-sm">{group.label}</h4>
            <div className="space-y-2">
              {group.options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={`${group.id}-${option.value}`}
                    name={group.id}
                    value={option.value}
                    checked={value === option.value}
                    onChange={(e) => handleFilterChange(group.id, e.target.value)}
                    className="w-4 h-4"
                  />
                  <Label
                    htmlFor={`${group.id}-${option.value}`}
                    className="flex-1 cursor-pointer text-sm font-normal"
                  >
                    {option.label}
                  </Label>
                  {showCounts && option.count !== undefined && (
                    <Badge variant="outline" className="text-xs">
                      {option.count}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'range':
        const rangeValue = value || [group.min || 0, group.max || 100];
        return (
          <div key={group.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">{group.label}</h4>
              <Badge variant="outline" className="text-xs">
                {Array.isArray(rangeValue) ? rangeValue.join(' - ') : rangeValue}
              </Badge>
            </div>
            <Slider
              min={group.min || 0}
              max={group.max || 100}
              step={group.step || 1}
              value={rangeValue as [number, number]}
              onValueChange={(newValue) => handleFilterChange(group.id, newValue)}
              className="py-4"
            />
          </div>
        );

      case 'select':
        return (
          <div key={group.id} className="space-y-2">
            <Label htmlFor={group.id} className="text-sm font-medium">
              {group.label}
            </Label>
            <Select
              value={value || ''}
              onValueChange={(newValue) => handleFilterChange(group.id, newValue)}
            >
              <SelectTrigger id={group.id}>
                <SelectValue placeholder={group.placeholder || 'Select...'} />
              </SelectTrigger>
              <SelectContent>
                {group.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center justify-between w-full">
                      <span>{option.label}</span>
                      {showCounts && option.count !== undefined && (
                        <span className="text-xs text-muted-foreground ml-2">
                          ({option.count})
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'text':
        return (
          <div key={group.id} className="space-y-2">
            <Label htmlFor={group.id} className="text-sm font-medium">
              {group.label}
            </Label>
            <Input
              id={group.id}
              type="text"
              value={value || ''}
              onChange={(e) => handleFilterChange(group.id, e.target.value)}
              placeholder={group.placeholder}
            />
          </div>
        );

      case 'date':
        return (
          <div key={group.id} className="space-y-2">
            <Label htmlFor={group.id} className="text-sm font-medium">
              {group.label}
            </Label>
            <Input
              id={group.id}
              type="date"
              value={value || ''}
              onChange={(e) => handleFilterChange(group.id, e.target.value)}
            />
          </div>
        );

      default:
        return null;
    }
  };

  const content = (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary">{activeFilterCount}</Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={handleReset}>
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset
              </Button>
            )}
            {collapsible && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <Collapsible open={isOpen && collapsible} onOpenChange={setIsOpen}>
        <CollapsibleContent>
          <CardContent className="space-y-6 pt-0">
            {groups.map((group) => (
              <div key={group.id}>{renderFilterGroup(group)}</div>
            ))}

            {activeFilterCount > 0 && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Active Filters</h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(filters).map(([key, value]) => {
                      if (!value || (Array.isArray(value) && value.length === 0)) {
                        return null;
                      }

                      const group = groups.find((g) => g.id === key);
                      const label = group?.label || key;
                      const displayValue = Array.isArray(value)
                        ? `${value.length} selected`
                        : value;

                      return (
                        <Badge key={key} variant="secondary" className="gap-1">
                          {label}: {displayValue}
                          <X
                            className="w-3 h-3 cursor-pointer"
                            onClick={() => handleFilterChange(key, group?.type === 'checkbox' ? [] : '')}
                          />
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );

  return content;
};

export default FilterPanel;
