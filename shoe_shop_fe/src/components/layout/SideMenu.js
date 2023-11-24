import React, {Component} from 'react'
import {Menu} from 'semantic-ui-react'
import {Link} from "react-router-dom";
import TextIcon from "./extension/TextIcon";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import { actionCreators } from "../layout/store/SideMenu";
import PropTypes from 'prop-types';

class SideMenu extends Component {
    static propTypes = {
        smallMenu: PropTypes.bool.isRequired,
        children: PropTypes.node.isRequired,
      };
    
      static state = {
        activeItem: 'dashboard',
    };

    handleItemClick = (e, {name}) => this.setState({activeItem: name});
    changeSize = () => this.setState({smallSidebar: !this.props.smallMenu});

    getMenu() {
        //const {activeItem} = this.state;
        return (
            <Menu fixed='left' borderless className={(this.props.smallMenu ? 'small-side' : '') + ' side'} vertical>
                

                <Menu.Item
                    as={Link} to={'/PageAdmin/AddProduct'}
                    
                    onClick={this.handleItemClick}
                    >
                    <TextIcon hideText={this.props.smallMenu} name='users'>
                        ADD PRODUCT
                    </TextIcon>
                </Menu.Item>
                <Menu.Item
                    as={Link} to={'/PageAdmin/EditProduct'}
                    onClick={this.handleItemClick}
                    >
                    <TextIcon hideText={this.props.smallMenu} name='users'>
                        Quản lý sản phẩm
                    </TextIcon>
                </Menu.Item>

                <Menu.Item
                    as={Link} to={'/PageAdmin/ManageOrder'}
                    onClick={this.handleItemClick}
                    >
                    <TextIcon hideText={this.props.smallMenu} name='users'>
                        Quản lý đơn hàng
                    </TextIcon>
                </Menu.Item>

                <Menu.Item
                    as={Link} to={'/PageAdmin/ManageUser'}
                    onClick={this.handleItemClick}
                    >
                    <TextIcon hideText={this.props.smallMenu} name='users'>
                        Quản lý người dùng
                    </TextIcon>
                </Menu.Item>

            </Menu>
        )
    }

    render() {
        
        return (
              <div className='parent'>
                <div className={(this.props.smallMenu ? 'small-side ' : '') + 'side'}>
                  {this.getMenu()}
                </div>
                <div className={(this.props.smallMenu ? 'small-content ' : '') + 'content'}>
                  {this.props.children}
                </div>
              </div>
            );
    }
}

export default connect(
    state => state.sideMenu,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(SideMenu);
