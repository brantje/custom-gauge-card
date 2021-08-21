/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/camelcase */
import { LitElement, html, TemplateResult, css, CSSResultGroup } from 'lit';
import { HomeAssistant, fireEvent, LovelaceCardEditor } from 'custom-card-helpers';
import { CustomGaugeCardConfig, SeverityConfig } from './types';
import { customElement, property, state } from 'lit/decorators';

const options = {
  required: {
    icon: 'tune',
    name: 'Required',
    secondary: 'Required options for this card to function',
    show: true,
  },
  // actions: {
  //   icon: 'gesture-tap-hold',
  //   name: 'Actions',
  //   secondary: 'Perform actions based on tapping/clicking',
  //   show: false,
  //   options: {
  //     tap: {
  //       icon: 'gesture-tap',
  //       name: 'Tap',
  //       secondary: 'Set the action to perform on tap',
  //       show: false,
  //     },
  //     hold: {
  //       icon: 'gesture-tap-hold',
  //       name: 'Hold',
  //       secondary: 'Set the action to perform on hold',
  //       show: false,
  //     },
  //     double_tap: {
  //       icon: 'gesture-double-tap',
  //       name: 'Double Tap',
  //       secondary: 'Set the action to perform on double tap',
  //       show: false,
  //     },
  //   },
  // },
  appearance: {
    icon: 'palette',
    name: 'Appearance',
    secondary: 'Customize the name, icon, etc',
    show: false,
  },
};

const includeDomains = ["counter", "input_number", "number", "sensor"];

@customElement('custom-gauge-card-editor')
export class BoilerplateCardEditor extends LitElement implements LovelaceCardEditor {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private config?: CustomGaugeCardConfig;
  @state() private _toggle?: boolean;
  @state() private _helpers?: any;
  private _initialized = false;

  public setConfig(config: CustomGaugeCardConfig): void {
    this.config = config;
    this.loadCardHelpers();
  }

  protected shouldUpdate(): boolean {
    if (!this._initialized) {
      this._initialize();
    }

    return true;
  }

  get _name(): string {
    return this.config?.name || "";
  }

  get _entity(): string {
    return this.config?.entity || "";
  }

  get _valueEntity(): string {
    return this.config?.valueEntity || "";
  }


  get _unit(): string {
    return this.config?.unit || "";
  }

  get _theme(): string {
    return this.config?.theme || "";
  }

  get _min(): number {
    return this.config?.min || 0;
  }

  get _max(): number {
    return this.config?.max || 100;
  }

  get _severity(): SeverityConfig | undefined {
    return this.config?.severity || undefined;
  }

  protected render(): TemplateResult | void {
    if (!this.hass || !this._helpers) {
      return html``;
    }

    // The climate more-info has ha-switch and paper-dropdown-menu elements that are lazy loaded unless explicitly done here
    //this._helpers.importMoreInfoControl('climate');

    // You can restrict on domain type

    return html`
            <div class="card-config">
        <ha-entity-picker
          .label="${this.hass.localize(
            "ui.panel.lovelace.editor.card.generic.entity"
          )} (${this.hass.localize(
            "ui.panel.lovelace.editor.card.config.required"
          )})"
          .hass=${this.hass}
          .value="${this._entity}"
          .configValue=${"entity"}
          .includeDomains=${includeDomains}
          @change="${this._valueChanged}"
          allow-custom-entity
        ></ha-entity-picker>
        <ha-entity-picker
          .label="Value ${this.hass.localize(
            "ui.panel.lovelace.editor.card.generic.entity"
          )}"
          .hass=${this.hass}
          .value="${this._valueEntity}"
          .configValue=${"valueEntity"}
          .includeDomains=${includeDomains}
          @change="${this._valueChanged}"
          allow-custom-entity
        ></ha-entity-picker>
        <paper-input
          .label="${this.hass.localize(
            "ui.panel.lovelace.editor.card.generic.name"
          )} (${this.hass.localize(
            "ui.panel.lovelace.editor.card.config.optional"
          )})"
          .value="${this._name}"
          .configValue=${"name"}
          @value-changed="${this._valueChanged}"
        ></paper-input>
        <paper-input
          .label="${this.hass.localize(
            "ui.panel.lovelace.editor.card.generic.unit"
          )} (${this.hass.localize(
            "ui.panel.lovelace.editor.card.config.optional"
          )})"
          .value=${this._unit}
          .configValue=${"unit"}
          @value-changed=${this._valueChanged}
        ></paper-input>
        <hui-theme-select-editor
          .hass=${this.hass}
          .value="${this._theme}"
          .configValue="${"theme"}"
          @value-changed="${this._valueChanged}"
        ></hui-theme-select-editor>
        <paper-input
          type="number"
          .label="${this.hass.localize(
            "ui.panel.lovelace.editor.card.generic.minimum"
          )} (${this.hass.localize(
            "ui.panel.lovelace.editor.card.config.optional"
          )})"
          .value="${this._min}"
          .configValue=${"min"}
          @value-changed="${this._valueChanged}"
        ></paper-input>
        <paper-input
          type="number"
          .label="${this.hass.localize(
            "ui.panel.lovelace.editor.card.generic.maximum"
          )} (${this.hass.localize(
            "ui.panel.lovelace.editor.card.config.optional"
          )})"
          .value="${this._max}"
          .configValue=${"max"}
          @value-changed="${this._valueChanged}"
        ></paper-input>
        <ha-formfield
          .label=${this.hass.localize(
            "ui.panel.lovelace.editor.card.gauge.needle_gauge"
          )}
        >
          <ha-switch
            .checked="${this.config?.needle !== undefined}"
            @change="${this._toggleNeedle}"
          ></ha-switch
        ></ha-formfield>
        <ha-formfield
          .label=${this.hass.localize(
            "ui.panel.lovelace.editor.card.gauge.severity.define"
          )}
        >
          <ha-switch
            .checked="${this.config?.severities !== undefined}"
            @change="${this._toggleSeverity}"
          ></ha-switch
        ></ha-formfield>
        </div>
    `;
  }

  private _initialize(): void {
    if (this.hass === undefined) return;
    if (this.config === undefined) return;
    if (this._helpers === undefined) return;
    this._initialized = true;
  }

  private async loadCardHelpers(): Promise<void> {
    this._helpers = await (window as any).loadCardHelpers();
  }

  private _toggleOption(ev): void {
    this._toggleThing(ev, options);
  }

  private _toggleThing(ev, optionList): void {
    const show = !optionList[ev.target.option].show;
    for (const [key] of Object.entries(optionList)) {
      optionList[key].show = false;
    }
    optionList[ev.target.option].show = show;
    this._toggle = !this._toggle;
  }

  private _valueChanged(ev): void {
    if (!this.config || !this.hass) {
      return;
    }
    const target = ev.target;
    if (this[`_${target.configValue}`] === target.value) {
      return;
    }
    if (target.configValue) {
      if (target.value === '') {
        const tmpConfig = { ...this.config };
        delete tmpConfig[target.configValue];
        this.config = tmpConfig;
      } else {
        this.config = {
          ...this.config,
          [target.configValue]: target.checked !== undefined ? target.checked : (isNaN(target.value)) ? target.value : parseInt(target.value),
        };
      }
    }
    fireEvent(this, 'config-changed', { config: this.config });
  }

  private _toggleSeverity(ev): void {
    if (!this.config || !this.hass) {
      return;
    }
    const target = ev.target;
    if (target.checked) {
      this.config = {
        ...this.config,
        severities: [
          {
            color: '#00b050',
            value: 0,
          },
          {
            color: '#ff0',
            value: 50,
          },
          {
            color: '#f00',
            value: 75,
          },
        ],
      };
    } else {
      this.config = { ...this.config };
      delete this.config.severities;
    }
    fireEvent(this, "config-changed", { config: this.config });
  }

  private _toggleNeedle(ev): void {
    if (!this.config || !this.hass) {
      return;
    }

    if (ev.target.checked) {
      this.config = {
        ...this.config,
        needle: true,
      };
    } else {
      this.config = { ...this.config };
      delete this.config.needle;
    }
    fireEvent(this, "config-changed", { config: this.config });
  }

  static get styles(): CSSResultGroup {
    return css`
      .option {
        padding: 4px 0px;
        cursor: pointer;
      }
      .row {
        display: flex;
        margin-bottom: -14px;
        pointer-events: none;
      }
      .title {
        padding-left: 16px;
        margin-top: -6px;
        pointer-events: none;
      }
      .secondary {
        padding-left: 40px;
        color: var(--secondary-text-color);
        pointer-events: none;
      }
      .values {
        padding-left: 16px;
        background: var(--secondary-background-color);
        display: grid;
      }
      ha-formfield {
        padding-bottom: 8px;
      }
    `;
  }
}
