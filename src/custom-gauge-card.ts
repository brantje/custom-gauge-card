/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  LitElement,
  html,
  TemplateResult,
  css,
  PropertyValues,
  CSSResultGroup,
} from 'lit';
import { customElement, property, state } from "lit/decorators";
import {
  HomeAssistant,
  hasConfigOrEntityChanged,
  handleAction,
  LovelaceCardEditor,
  getLovelace,
} from 'custom-card-helpers'; // This is a community maintained npm module with common helper functions/types

import './editor';
import { styleMap } from "lit/directives/style-map";
import type { CustomGaugeCardConfig } from './types';

import { CARD_VERSION } from './const';
import { localize } from './localize/localize';
import { computeStateName } from "./lib/compute_state_name";
/* eslint no-console: 0 */
console.info(
  `%c  BOILERPLATE-CARD \n%c  ${localize('common.version')} ${CARD_VERSION}    `,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray',
);

// This puts your card into the UI card picker dialog
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'custom-gauge-card',
  name: 'Custom Gauge Card',
  description: 'A template custom card for you to create something awesome',
});


@customElement('custom-gauge-card')
export class CustomGaugeCard extends LitElement {
  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    return document.createElement('custom-gauge-card-editor');
  }

  public static getStubConfiggetStubConfig(): any {
    return { type: "gauge", entity: "" };
  }

  // https://lit-element.polymer-project.org/guide/properties
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private config!: CustomGaugeCardConfig;

  // https://lit-element.polymer-project.org/guide/properties#accessors-custom
  public async setConfig(config: CustomGaugeCardConfig): Promise<void> {
    if (!config) {
      throw new Error(localize('common.invalid_configuration'));
    }

    if (config.test_gui) {
      getLovelace().setEditMode(true);
    }

    this.config = {
      min: 0,
      max: 500,
      ...config,
    };

    // if (!customElements.get("ha-gauge")) {
    //   const cardHelpers = await window!.loadCardHelpers();
    //   cardHelpers.createCardElement({type: "gauge"});
    // }
  }

  // https://lit-element.polymer-project.org/guide/lifecycle#shouldupdate
  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (!this.config) {
      return false;
    }

    return hasConfigOrEntityChanged(this, changedProps, false);
  }

  // https://lit-element.polymer-project.org/guide/templates
  protected render(): TemplateResult | void {

    if (!this.config || !this.hass) {
      return html``;
    }

    const stateObj = this.hass.states[this.config.entity];

    if (!stateObj) {
      return this._showWarning(localize('common.show_warning'));
    }

    const entityState = this._getEntityStateValue(stateObj, this.config.attribute);
    let value;
    if (this.config.valueEntity) {
      value = this.hass.states[this.config.valueEntity].state;
    }
    console.log
    return html`
      <ha-card
        @click=${this._handleAction}
        tabindex="0"
      >
      <ha-gauge
          .min=${this.config.min}
          .max=${this.config.max}
          .value=${entityState}
          .valueText=${value || undefined}
          .locale=${this.hass.locale}
          .label=${this.config.unit ||
          this.hass?.states[this.config.valueEntity || this.config.entity].attributes
            .unit_of_measurement ||
          ""}
          style=${styleMap({
            "--gauge-color": this._computeSeverity(entityState),
          })}
          .needle=${this.config.needle}
          .levels=${this.config.needle ? this._severityLevels() : undefined}
        ></ha-gauge>
        <div class="name">
          ${this.config.name || computeStateName(stateObj)}
        </div>
    </ha-card>
    `;
  }

  private _getEntityStateValue(entity, attribute): any {
    if (!attribute) {
      return entity.state;
    }

    return entity.attributes[attribute];
  }

  private _severityLevels(): Array<object> {
    if (!this.config.severities) {
      return [{
        level: 0,
        stroke: 'var(--primary-background-color)'
      }];
    }

    if (this.config?.severities) {
      const severities = this.config?.severities.map((severity) => ({
        level: severity?.value,
        stroke: severity?.color,
      }));
      return severities;
    }
    return [];
  }

  private _handleAction(ev): void {
    console.log(ev)
    if (this.hass && this.config) {
      handleAction(this, this.hass, this.config, "hass-more-info");
    }
  }

  private _showWarning(warning: string): TemplateResult {
    return html`
      <hui-warning>${warning}</hui-warning>
    `;
  }

  private _showError(error: string): TemplateResult {
    const errorCard = document.createElement('hui-error-card');
    errorCard.setConfig({
      type: 'error',
      error,
      origConfig: this.config,
    });

    return html`
      ${errorCard}
    `;
  }


  private _computeSeverity(value: number): string {
    const sections = this.config?.severities;

    if (!sections) {
      return "var(--label-badge-blue)";
    }
    let i = 0;
    const count = sections.length;
    let color = 'var(--label-badge-blue)';
    for (; i < count; i++) {
      if (value >= sections[i].value) {
        color = sections[i].color;
      }
    }

    return color;
  }


  // https://lit-element.polymer-project.org/guide/styles
  static get styles(): CSSResultGroup {
    return css`
      ha-card {
        cursor: pointer;
        height: 100%;
        overflow: hidden;
        padding: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        box-sizing: border-box;
      }
      ha-card:focus {
        outline: none;
        background: var(--divider-color);
      }
      ha-gauge {
        --gauge-color: var(--label-badge-blue);
        width: 100%;
        max-width: 250px;
      }
      .name {
        text-align: center;
        line-height: initial;
        color: var(--primary-text-color);
        width: 100%;
        font-size: 15px;
        margin-top: 8px;
      }
    `;
  }
}
