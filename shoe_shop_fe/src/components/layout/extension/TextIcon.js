    import React, {Component} from 'react';
    import PropTypes from 'prop-types';
    import {Icon} from "semantic-ui-react";

    export default class TextIcon extends Component {

        style = {
            alignSelf: 'center',
            padding: '4px',
            marginTop:'5%',
            marginLeft:'40px',
            borderBottom: '1px solid #000000',
        };

        static propTypes = {
            name: PropTypes.string.isRequired,
            hideText: PropTypes.bool.isRequired,
            color: PropTypes.string,
            children: PropTypes.node,
        };

        render() {
            return (
                <div style={{whiteSpace: 'nowrap', display: 'inline-flex'}}>
                    <Icon size='large'
                        color={this.props.color}
                        name={this.props.name}/>
                    <div style={this.style} hidden={this.props.hideText}>
                        {this.props.children}
                    </div>
                </div>
            );
        }
    }
