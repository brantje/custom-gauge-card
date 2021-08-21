import { LovelaceCard, LovelaceCardConfig, LovelaceCardEditor } from 'custom-card-helpers';

declare global {
  interface HTMLElementTagNameMap {
    'custom-gauge-card-editor': LovelaceCardEditor;
    'hui-error-card': LovelaceCard;
  }
}

export declare type serverity = SeverityConfig;

export interface SeverityConfig {
  color: string;
  value: number;
}

export interface CustomGaugeCardConfig extends LovelaceCardConfig {
  type: string;
  name?: string;
  entity: string;
  unit: string;
  attribute?: string;
  valueEntity?: string;
  min?: number;
  max?: number;
  severities?: Array<serverity>;
  needle?: boolean;
}
