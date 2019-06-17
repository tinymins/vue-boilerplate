import Vue, { VNode, VNodeData } from 'vue'

declare global {
  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode {}
    // tslint:disable no-empty-interface
    interface ElementClass extends Vue {}
    interface IntrinsicClassAttributes extends VNodeData {}
    interface IntrinsicElements {
      [elem: string]: any
    }
    interface ElementAttributesProperty {
      $props: any
    }
  }
}
