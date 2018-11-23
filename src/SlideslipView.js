'use strict';
import React, {
    PureComponent,
} from 'react';
import {
    PanResponder,
    View,
    UIManager,
} from 'react-native';

export default class SlideslipView extends PureComponent {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态

        this._drag = [];
        this.target = {};

        this._panResponder = PanResponder.create({
            // 要求成为响应者：
            onStartShouldSetPanResponder: (evt, gestureState) => {
                if (this.target[evt.target]) {
                    return false;
                }
                if (this._drag.length == 0) {
                    return false;
                }
                return true;
            },
            onStartShouldSetPanResponderCapture: (evt, gestureState) => {

                if (this.target[evt.target]) {
                    return false;
                }
                if (this._drag.length == 0) {
                    return false;
                }
                return true;
            },
            onMoveShouldSetPanResponder: (evt, gestureState) => false,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,

            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onPanResponderGrant: (evt, gestureState) => {

                if (this._drag) {
                    this._drag.forEach((v, k) => {
                        v.snapTo({index: 0});
                    })
                }
            }
        });
    }

    render() {
        return (
            <View {...this._panResponder.panHandlers} {...this.props}>
                {this.props.children}
            </View>
        );
    }

    onStop(view, flag) {
        if (flag) {
            this._push(view);
        } else {
            this._pop(view);
        }
    }

    onDelete(view) {
        this._pop(view);
    }

    onTarget(target) {
        this.target[target] = true;
    }

    _push(view) {
        let find = false;
        for (let i = 0; i < this._drag.length; i++) {
            if (this._drag[i] == view) {
                find = true;
                break;
            }
        }
        if (!find) {
            this._drag.push(view)
        }
    }

    _pop(view) {
        for (let i = 0; i < this._drag.length; i++) {
            if (this._drag[i] == view) {
                this._drag.splice(i, 1);
                break;
            }
        }
    }

}