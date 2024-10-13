import i18n from '@/plugins/i18n';

// Types for number comparison conditions
export const numberConditionValues = {
    greater: i18n.global.t('value.greater'),
    less: i18n.global.t('value.less'),
    equal: i18n.global.t('value.equal'),
    notEqual: i18n.global.t('value.notEqual')
} as const;

export type NumberCondition = keyof typeof numberConditionValues;

// Types for text comparison conditions
export const textConditionValues = {
    startsWith: i18n.global.t('value.startsWith'),
    endsWith: i18n.global.t('value.endsWith'),
    contains: i18n.global.t('value.contains'),
    doesNotContain: i18n.global.t('value.doesNotContain')
} as const;

export type TextCondition = keyof typeof textConditionValues;

// Types for date comparison conditions
export const dateConditionValues = {
    greater: i18n.global.t('value.greater'),
    less: i18n.global.t('value.less')
} as const;

export type DateCondition = keyof typeof dateConditionValues;

// Combined type for all criteria
export type FilterCriterion = {
    field_id: string;
    condition: NumberCondition | TextCondition | DateCondition | null;
    value: number | string | Date | null;
};

export type Filter = {
    id: number | null;
    name: string;
    criteria: Array<FilterCriterion>;
    selection: number | null;
}

export type FilterField = {
    name: string;
    criteria_type: 'number' | 'date' | 'text';
}

export type FilterName = {
    id: number;
    name: string
}
