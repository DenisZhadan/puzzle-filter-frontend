<template>
  <div class="row mb-2">
    <div class="col-1 w-110">{{ $t('main.filterName') }}</div>
    <div class="col">
      <input type="text" v-model="localFilter.name"
             :class="['form-control', {'is-invalid' : v$.localFilter.name.$error}]"
             :placeholder="$t('main.enterFilterName')"/>
    </div>
  </div>

  <div class="row mb-0">
    <div class="col-1 w-110">{{ $t('main.criteria') }}</div>
    <div class="col">
      <div class="input-group mb-2" v-for="(criterion, index) in localFilter.criteria" :key="index">
        <select v-model="criterion.field_id"
                @change="clearCriteria(index)"
                class="form-select">
          <option v-for="(field, fieldIndex) in fieldList" :key="fieldIndex" :value="fieldIndex">
            {{ field.name }}
          </option>
        </select>
        <select class="form-select" v-model="criterion.condition"
                :class="['form-select',  {'is-invalid' : v$.localFilter.criteria.$each.$response.$errors[index].condition.length}]">
          <option v-for="(criteriaName, criteriaId) in getConditions(criterion.field_id)"
                  :key="criteriaId" :value="criteriaId">
            {{ criteriaName }}
          </option>
        </select>
        <input type="number" v-model="criterion.value" v-if="getConditionType(criterion.field_id) === 'number'"
               :class="['form-control', {'is-invalid' : v$.localFilter.criteria.$each.$response.$errors[index].value.length}]"
               :placeholder="$t('main.enterNumber')"/>
        <input type="text" v-model="criterion.value" v-if="getConditionType(criterion.field_id) === 'text'"
               :class="['form-control', {'is-invalid' : v$.localFilter.criteria.$each.$response.$errors[index].value.length}]"
               :placeholder="$t('main.enterText')"/>
        <input type="date" v-model="criterion.value" v-if="getConditionType(criterion.field_id) === 'date'"
               :class="['form-control', {'is-invalid' : v$.localFilter.criteria.$each.$response.$errors[index].value.length}]"
               :placeholder="$t('main.enterDate')"/>
        <button class="btn btn-danger" @click="removeCriteria(index)"><i class="bi bi-dash-lg"/></button>
      </div>
    </div>
  </div>

  <div class="row justify-content-center mb-3">
    <div class=" col-md-3">
      <button class="btn btn-secondary mt-2" @click="addCriteria">
        <i class="bi bi-plus-lg"/> {{ $t('main.addRow') }}
      </button>
    </div>
  </div>

  <div class="row">
    <div class="col-1 w-110">{{ $t('main.selection') }}</div>
    <div class="col">
      <div class="form-check form-check-inline">
        <input type="radio" id="selection1" name="selection"
               v-model.number="localFilter.selection"
               class="form-check-input"
               :value="1"/>
        <label for="selection1" class="form-check-label">{{ $t('value.selection1') }}</label>
      </div>
      <div class="form-check form-check-inline">
        <input type="radio" id="selection2" name="selection"
               v-model.number="localFilter.selection"
               class="form-check-input"
               :value="2"/>
        <label for="selection1" class="form-check-label">{{ $t('value.selection2') }}</label>
      </div>
      <div class="form-check form-check-inline">
        <input type="radio" id="selection3" name="selection"
               v-model.number="localFilter.selection"
               class="form-check-input"
               :value="3"/>
        <label for="selection1" class="form-check-label">{{ $t('value.selection3') }}</label>
      </div>
    </div>
  </div>
</template>

<style>
div.w-110 {
  min-width: 110px;
}
</style>

<script lang="ts">
import {defineComponent, nextTick, type PropType} from 'vue';
import {
  numberConditionValues, textConditionValues, dateConditionValues, type Filter, type FilterField,
} from '@/types';
import {useVuelidate} from "@vuelidate/core";
import {helpers, required} from "@vuelidate/validators";

export default defineComponent({
  name: 'FilterBody',
  props: {
    localFilter: {
      type: Object as PropType<Filter>,
      required: true
    },
    modalBody: {
      type: Object as PropType<HTMLElement | null>,
      default: null
    },
    fieldList: {
      type: Object as PropType<Record<string, FilterField>>,
      default: {}
    }
  },
  setup() {
    const numberConditions: Array<string> = Object.values(numberConditionValues);
    const textConditions: Array<string> = Object.values(textConditionValues);
    const dateConditions: Array<string> = Object.values(dateConditionValues);

    return {
      numberConditions,
      textConditions,
      dateConditions,
      v$: useVuelidate()
    };
  },
  validations() {
    return {
      localFilter: {
        name: {
          required,
          $autoDirty: true
        },
        criteria: {
          $each: helpers.forEach({
            condition: {
              required
            },
            value: {
              required
            }
          })
        }
      }
    }
  },
  mounted() {
    this.v$.$validate();
  },
  methods: {
    getConditionType(field_id: string) {
      return this.fieldList[field_id].criteria_type;
    },
    getConditions(field_id: string) {
      switch (this.getConditionType(field_id)) {
        case 'number':
          return numberConditionValues;
        case 'text':
          return textConditionValues;
        case 'date':
          return dateConditionValues;
        default:
          return [];
      }
    },
    async addCriteria() {
      this.localFilter.criteria.push({field_id: 'amount', condition: null, value: null});
      await nextTick();
      if (this.modalBody) {
        this.modalBody.scrollTop = this.modalBody.scrollHeight;
      }
    },
    removeCriteria(index: number) {
      if (this.localFilter.criteria.length > 1) {
        this.localFilter.criteria.splice(index, 1);
      }
    },
    clearCriteria(index: number) {
      this.localFilter.criteria[index].condition = null;
      this.localFilter.criteria[index].value = null;
    }
  }
});
</script>

