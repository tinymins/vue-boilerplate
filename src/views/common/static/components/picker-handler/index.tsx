/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

import { VNode } from 'vue';
import { namespace } from 'vuex-class';
import { Vue, Component } from 'vue-property-decorator';
import { StoreCommonBusState } from '@/store/common/bus';
import { PickerData } from './types';
import PickerTags from './picker-tags';
import PickerCascade from './picker-cascade';

const commonBusModule = namespace('common/bus');

@Component
export default class PickerHandler extends Vue {
  @commonBusModule.State private readonly pickers!: StoreCommonBusState['pickers'];

  /** 当前渲染的数据 */
  private get picker(): PickerData | null {
    return this.pickers[0] || null;
  }

  private get pickerType(): Required<PickerData>['type'] | null {
    if (this.picker) {
      if (this.picker.type) {
        return this.picker.type;
      }
      return this.picker.maxLimit && this.picker.maxLimit > 1 ? 'picker-tags' : 'picker-cascade';
    }
    return null;
  }

  private get pickerTags(): PickerData | null {
    return this.picker && this.pickerType === 'picker-tags' ? this.picker : null;
  }

  private get pickerCascade(): PickerData | null {
    return this.picker && this.pickerType === 'picker-cascade' ? this.picker : null;
  }

  public render(): VNode {
    return <div>
      <PickerTags data={this.pickerTags}></PickerTags>
      <PickerCascade data={this.pickerCascade}></PickerCascade>
    </div>;
  }
}
