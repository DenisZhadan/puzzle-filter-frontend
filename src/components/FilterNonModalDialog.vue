<template>
  <div class="card">
    <div class="card-header bg-info text-white d-flex"> {{ $t('header.filter') }}
      <div class="ms-auto">
        <button type="button" class="btn-close btn-close-white" @click="close"/>
      </div>
    </div>

    <div class="card-body">
      <FilterBody :localFilter="localFilter" :fieldList="fieldList"/>
    </div>

    <div class="card-footer bg-light ">
      <div class="text-center">
        <button class="btn btn-secondary me-3 " @click="close">{{ $t('button.close') }}</button>
        <button class="btn btn-info ms-3 text-white" @click="saveFilter">{{ $t('button.save') }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>

<script lang="ts">
import {defineComponent, ref, type PropType} from 'vue';
import type {Filter, FilterField} from '@/types';
import FilterBody from './FilterBody.vue';

export default defineComponent({
  name: 'FilterNonModalDialog',
  components: {
    FilterBody: FilterBody
  },
  props: {
    modal: {
      type: Boolean,
      default: true
    },
    filter: {
      type: Object as PropType<Filter>,
      default: () => ({id: null, name: '', criteria: [], selection: null}),
    },
    fields:{
      type: Object as PropType<Record<string, FilterField>>,
      default: {}
    },
    save: {
      type: Function as PropType<(filter: Filter) => void>,
      required: true
    },
    close: {
      type: Function as PropType<() => void>,
      required: true
    }
  },
  setup(props) {
    const localFilter = ref<Filter>(props.filter);
    const  fieldList = ref<Record<string, FilterField>>(props.fields);
    const modalBody = ref<HTMLElement | null>(null);

    return {
      localFilter,
      fieldList,
      modalBody
    };
  },
  methods: {
    saveFilter() {
      this.save(this.filter);
    }
  }
});

</script>
