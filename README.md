# Custom Gauge Card by [@brantje](https://www.github.com/brantje)

A customizable guage card for Home Assistant

[![GitHub Release][releases-shield]][releases]
[![License][license-shield]](LICENSE.md)
[![hacs_badge](https://img.shields.io/badge/HACS-Default-orange.svg?style=for-the-badge)](https://github.com/custom-components/hacs)
[![GitHub Activity][commits-shield]][commits]

## Options

| Name        | Type                 | Requirement  | Description                                           | Default                             |
| ----------- | -------------------- | ------------ | ----------------------------------------------------- | ----------------------------------- |
| type        | string               | **Required** | `custom:custom-gauge-card`                            |                                     |
| name        | string               | **Optional** | Card name                                             |                                     |
| entity      | string               | **Required** | Entity ID to show.                                    |                                     |
| attribute   | string               | **Optional** | Use this attribute of the entity instead of its state |                                     |
| unit        | string               | **Optional** | Unit of measurement given to data.                    | Unit of measurement given by entity |
| valueEntity | string               | **Optional** | Use this enity to display the value (below the gauge) |                                     |
| min         | number               | **Optional** | Minimum value for graph                               | 0                                   |
| max         | number               | **Optional** | Maximum value for graph                               | 100                                 |
| needle      | boolean              | **Optional** | Show the gauge as a needle gauge.                     | `false`                             |
| severities  | array of serverities | **Optional** | See below                                             |                                     |

## Severity Options

| Name  | Type   | Requirement  | Description                      | Default |
| ----- | ------ | ------------ | -------------------------------- | ------- |
| color | string | **Required** | Color to show in the gauge       | `none`  |
| value | string | **Required** | Minimum value to show this color | `none`  |

## Examples

![](https://i.imgur.com/RcH7Nm5.png)

```yaml
type: custom:custom-gauge-card
entity: sensor.random_number
min: 0
max: 500
```

![](https://i.imgur.com/S6u15ic.png)

```yaml
type: custom:custom-gauge-card
min: 0
max: 500
entity: sensor.random_number
needle: true
severities:
  - color: '#00b050'
    value: 0
  - color: '#ff0'
    value: 50
  - color: '#f00'
    value: 75
```

![](https://i.imgur.com/QxaffJi.png)

```yaml
type: custom:custom-gauge-card
entity: sensor.random_number
min: 0
max: 500
severities:
  - color: '#00b050'
    value: 0
  - color: '#ff0'
    value: 50
  - color: '#f00'
    value: 75
```

[license-shield]: https://img.shields.io/github/license/brantje/custom-gauge-card.svg?style=for-the-badge
[commits-shield]: https://img.shields.io/github/commit-activity/y/brantje/custom-gauge-card.svg?style=for-the-badge
[commits]: https://github.com/brantje/custom-gauge-card/commits/master
[releases-shield]: https://img.shields.io/github/release/brantje/custom-gauge-card.svg?style=for-the-badge
[releases]: https://github.com/brantje/custom-gauge-card/releases
