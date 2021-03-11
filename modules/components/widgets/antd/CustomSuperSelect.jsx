import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {useOnPropsChanged, mapListValues, calcTextWidth, SELECT_WIDTH_OFFSET_RIGHT} from '../../../utils/stuff';
import SuperSelect  from 'antd-virtual-select';

import {Select} from 'antd';
const Option = Select.Option;

export default class SuperSelectWidget extends PureComponent {
  static propTypes = {
    setValue: PropTypes.func.isRequired,
    config: PropTypes.object.isRequired,
    field: PropTypes.string.isRequired,
    value: PropTypes.string, //key in listValues
    customProps: PropTypes.object,
    fieldDefinition: PropTypes.object,
    readonly: PropTypes.bool,
    // from fieldSettings:
    listValues: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  };

  constructor(props) {
      super(props);
      useOnPropsChanged(this);
      this.onPropsChanged(props);
  }

  onPropsChanged (props) {
    const {listValues} = props;

    let optionsMaxWidth = 0;
    mapListValues(listValues, ({title, value}) => {
      optionsMaxWidth = Math.max(optionsMaxWidth, calcTextWidth(title, null));
    });
    this.optionsMaxWidth = optionsMaxWidth;

    this.options = mapListValues(listValues, ({title, value}) => {
      return (<Option key={value} value={value}>{title}</Option>);
    });
  }

  handleChange = (val) => {
    this.props.setValue(val);
  }

  filterOption = (input, option) => {
    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  }

  render() {
    const {config, placeholder, customProps, value, readonly} = this.props;
    const {renderSize} = config.settings;
    const placeholderWidth = calcTextWidth(placeholder);
    const dropdownWidth = this.optionsMaxWidth + SELECT_WIDTH_OFFSET_RIGHT;
    const width = value ? dropdownWidth : placeholderWidth + SELECT_WIDTH_OFFSET_RIGHT;
    const _value = value != undefined ? value : undefined;

    return (
        <SuperSelect
            disabled={readonly}
            style={{ width }}
            key={"widget-select"}
            dropdownMatchSelectWidth={true}
            ref="val"
            placeholder={placeholder}
            size={renderSize}
            value={_value}
            onChange={this.handleChange}
            filterOption={this.filterOption}
            {...customProps}
          >{this.options}
        </SuperSelect>
    );
  }
}
