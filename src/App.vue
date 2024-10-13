<template>
  <header class="p-2 text-bg-dark">
    <div class="container">
      <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
        <div class="text-end  me-auto">
          <button type="button" class="btn btn-light" @click="addNewFilter">{{ $t('header.addFilter') }}</button>
        </div>
        <div class="">
          <label for="modeSwitch" class="form-label me-3">{{ $t('header.switchToModalMode') }}</label>
          <input type="checkbox" id="modeSwitch" v-model="isModal"/>
        </div>
      </div>
    </div>
  </header>

  <div class="container">
    <div v-if="!isModal && showDialog && currentFilterId === null">
      <FilterNonModalDialog :modal="isModal" :filter="currentFilter" :fields="fieldList"
                            :close="closeDialog" :save="saveFilter"/>
    </div>

    <div v-if="filterList.length">
      <h2>{{ $t('main.savedFilters') }}</h2>
      <ul class="list-group">
        <li class="list-group-item" v-for="filter in filterList" :key="filter.id">
          <div class="d-flex justify-content-between align-items-center">
            <div role="button" @click.prevent="editFilter(filter.id)">{{ filter.name }}</div>
            <button class="btn text-danger bi-trash justify-content-end" @click="deleteFilter(filter.id)"></button>
          </div>
          <div v-if="!isModal && showDialog && currentFilterId === filter.id">
            <FilterNonModalDialog :modal="isModal" :filter="currentFilter" :fields="fieldList"
                                  :close="closeDialog" :save="saveFilter"/>
          </div>
        </li>
      </ul>
    </div>
  </div>

  <div class="modal fade" id="filterDialog" data-bs-backdrop="static" tabindex="-1" aria-labelledby="filterDialogTitle"
       aria-hidden="true">
    <div class="modal-dialog modal-lg" ref="modalDialog">
      <div class="modal-content modal-dialog-scrollable">
        <div class="modal-header bg-info">
          <h1 class="modal-title fs-5 text-white">{{ $t('header.filter') }}</h1>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"/>
        </div>

        <div class="modal-body modal-dialog-scrollable" ref="modalBody">
          <FilterBody v-if="isModal && showDialog" :modalBody="modalBody"
                      :localFilter="currentFilter" :fieldList="fieldList"/>
        </div>

        <div class="modal-footer justify-content-center bg-light">
          <button class="btn btn-secondary me-3 " @click="closeDialog()">{{ $t('button.close') }}</button>
          <button class="btn btn-info ms-3 text-white" @click="saveFilter(currentFilter)">
            {{ $t('button.save') }}
          </button>
        </div>

        <div class="resize-handle" @mousedown="initResize"></div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-body {
  height: 310px; /* Set the maximum height for the dialog */
  overflow-y: auto; /* Enable vertical scrolling */
}

.modal-dialog {
  position: relative !important;
}

.resize-handle {
  width: 100%;
  height: 10px;
  background: #ccc;
  cursor: ns-resize;
  position: absolute;
  bottom: 0;
  left: 0;
}
</style>

<script lang="ts">
import {defineComponent, ref} from 'vue';
import FilterNonModalDialog from './components/FilterNonModalDialog.vue';
import FilterBody from "@/components/FilterBody.vue";
import ApiService from "@/services/ApiService";
import type {Filter, FilterField, FilterName} from './types';
import {Modal} from 'bootstrap';


export default defineComponent({
  name: 'App',
  components: {
    FilterBody,
    FilterNonModalDialog
  },
  setup() {
    const modalBody = ref<HTMLElement | null>(null);
    const showDialog = ref(false);

    return {
      modalBody,
      showDialog,
      currentFilterId: -1 as number | null
    };
  },
  data() {
    return {
      isModal: true as boolean,
      modalDialog: null as HTMLElement | null,
      filterList: [] as Array<FilterName>,
      currentFilter: {id: null, name: '', criteria: [], selection: null} as Filter,
      fieldList: {} as Record<string, FilterField>
    }
  },
  mounted() {
    this.getFilters();
    this.modalDialog = this.$refs.modalDialog as HTMLElement;
    const modalElement = document.getElementById('resizableModal');
    if (modalElement) {
      modalElement.addEventListener('shown.bs.modal', () => {
        if (this.modalDialog) {
          this.modalDialog.style.height = 'auto';
        }
      });
    }
  },
  methods: {
    showModal() {
      const dialog = Modal.getOrCreateInstance(document.getElementById('filterDialog')!);
      if (dialog) {
        dialog.show();
      }
    },
    async editFilter(id: number) {
      if (!await this.getFilter(id)) {
        return;
      }
      this.currentFilterId = id;
      this.showDialog = true;

      if (this.isModal) {
        this.showModal();
      }
    },
    addNewFilter() {
      this.currentFilter = ({
        id: null,
        name: '',
        selection: null,
        criteria: [{field_id: 'amount', condition: null, value: null}]
      });
      this.currentFilterId = null;
      this.showDialog = true;

      if (this.isModal) {
        this.showModal();
      }
    },
    initResize(event: MouseEvent) {
      if (!this.modalDialog) return;

      const startY = event.clientY;
      const startHeight = parseInt(window.getComputedStyle(this.modalDialog).height, 10);

      const doDrag = (e: MouseEvent) => {
        if (this.modalDialog) {
          this.modalDialog.style.height = `${startHeight + e.clientY - startY}px`;
        }
      };

      const stopDrag = () => {
        document.documentElement.removeEventListener('mousemove', doDrag, false);
        document.documentElement.removeEventListener('mouseup', stopDrag, false);
      };

      document.documentElement.addEventListener('mousemove', doDrag, false);
      document.documentElement.addEventListener('mouseup', stopDrag, false);
    },
    closeDialog() {
      if (this.isModal) {
        const dialog = Modal.getInstance(document.getElementById('filterDialog')!);
        if (dialog !== null) {
          dialog.hide();
        }
      }
      this.showDialog = false;
      this.currentFilterId = -1;
    },
    async getFilters() {
      try {
        const response = await ApiService.get(
            "filters/"
        );

        if (response.data.result) {
          this.filterList = response.data.list;
          this.fieldList = response.data.fields;
        }
      } catch (error: unknown) {
        //
      } finally {
        //
      }
    },
    async getFilter(id: number): Promise<boolean> {
      try {
        const response = await ApiService.get(
            "filters/" + id.toString() + '/'
        );

        if (response.data.result) {
          this.currentFilter = response.data.filter;
        }

        return response.data.result;
      } catch (error: unknown) {
        return false;
      } finally {
        //
      }
    },
    async addFilter(filter: Filter): Promise<boolean> {
      try {
        const response = await ApiService.post(
            "filters/",
            filter
        );

        return response.data.result;
      } catch (error: unknown) {
        return false;
      } finally {
        //
      }
    },
    async updateFilter(filter: Filter, id: number): Promise<boolean> {
      try {
        const response = await ApiService.put(
            "filters/" + id.toString() + '/',
            filter
        );

        return response.data.result;
      } catch (error: unknown) {
        return false;
      } finally {
        //
      }
    },
    async saveFilter(filter: Filter) {
      let result: boolean = false;

      if (filter.name === null || filter.name.trim() === '') {
        return;
      }

      if (filter.id === null) {
        result = await this.addFilter(filter);
      } else {
        result = await this.updateFilter(filter, filter.id);
      }
      if (result) {
        await this.getFilters();
        this.closeDialog();
      }
    },
    async deleteFilter(id: number) {
      try {
        await ApiService.delete(
            "filters/" + id.toString() + '/'
        );

        await this.getFilters();
      } catch (error: unknown) {
        return false;
      } finally {
        //
      }
    }
  }
});
</script>
