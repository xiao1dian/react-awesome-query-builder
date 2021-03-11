import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {Select, Spin} from 'antd';
import {calcTextWidth, SELECT_WIDTH_OFFSET_RIGHT} from "../../../utils/stuff";
import { format } from 'react-string-format';

const Option = Select.Option;


export default class SearchTextWidget extends PureComponent {
  static propTypes = {
    setValue: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    config: PropTypes.object.isRequired,
    value: PropTypes.string,
    field: PropTypes.string.isRequired,
    readonly: PropTypes.bool,
    customProps: PropTypes.object,
  };

  state = {
    fetching: false,
    data: [],
    value: undefined,

  }

  constructor(props) {
    super(props);
    const { url } = this.props;
    this.optionsMaxWidth = 100;
    this.url = url;
    this.timeout =null;
    this.currentValue = '';
  }

  handleChange = (val) => {
    this.props.setValue(val);
    this.setState({ value: val });
  }

  handleSearch = (value) => {
    if (value) {
      this.setState({ fetching: true });
      this.fetch(value)
    } else {
      this.setState({ data: [] });
    }
  };

  filterOption = (input, option) => {
    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  }

  fetch = (value) => {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
    this.currentValue = value;

    const search = () => {
      fetch(format(this.url, value))
        .then((response) => response.json())
        .then((body) => {
          const data = [];
          let optionsMaxWidth = 0;

          if (this.currentValue === value) {
            body.forEach(item => {
              data.push({
                    value: item,
                    text: item
                  });
              optionsMaxWidth = Math.max(optionsMaxWidth, calcTextWidth(item, null));
            })
            this.optionsMaxWidth = optionsMaxWidth;
            this.setState({data: data})
            this.setState({fetching: false});
          }
        })
    };
    this.timeout = setTimeout(search, 300);
  }

  render() {
    const {config, placeholder, customProps, value, readonly} = this.props;
    const {renderSize} = config.settings;
    const placeholderWidth = calcTextWidth(placeholder);
    const dropdownWidth = this.optionsMaxWidth === 0 ?  placeholderWidth : this.optionsMaxWidth + SELECT_WIDTH_OFFSET_RIGHT;
    const width = value ? dropdownWidth : placeholderWidth + SELECT_WIDTH_OFFSET_RIGHT;
    const _value = value != undefined ? value : undefined;
    const latestOptions = this.state.data.map((d) => (
        <Option key={d.value}>{d.text}</Option>
    ));
    return (
        <Select
            showSearch
            disabled={readonly}
            style={{ width }}
            key="widget-text"
            dropdownMatchSelectWidth={false}
            // ref="val"
            // placeholder={placeholder}
            // size={renderSize}
            // // value={_value}
            // value={this.state.value}
            // onChange={this.handleChange}
            // onSearch={this.handleSearch}
            // filterOption={this.filterOption}
            // notFoundContent={
            //   this.state.fetching ? <Spin size="small" /> : "No Content"
            // }

            ref="text"
            type={"text"}
            // value={this.state.value}
            value={_value}

            placeholder={placeholder}
            size={renderSize}
            onChange={this.handleChange}
            onSearch={this.handleSearch}
            filterOption={this.filterOption}
            notFoundContent={
              this.state.fetching ? <Spin size="small" /> : null
            }
            {...customProps}
        >{latestOptions}
        </Select>
    );

  }
}
