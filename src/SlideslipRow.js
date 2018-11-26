'use strict';
import React, {
    Component,
} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Animated,
    TouchableWithoutFeedback
} from 'react-native';
import Interactable from 'react-native-interactable';

const PropTypes = require('prop-types');

export default class SlideslipRow extends Component {

    // 构造
    constructor(props) {
        super(props);
        this._deltaX = new Animated.Value(0);

        this.index = 0;
        this.state = {};
    }

    render() {

        return (

            <View style={{
            flex: 1, backgroundColor: '#fff', overflow: 'hidden'
        }}>

    <View style={{position: 'absolute', left: 0, right: 0, height: '100%'}}>
        {this.props.menus && this.props.menus.map((v, k) => (
            <Animated.View ref={(r) => this.anim = r} key={k} style={
            [styles.trashHolder, {
            backgroundColor: v.color,
                right: (this.props.menus.length - 1 - k) * 80,
        }
        ]}>

        <TouchableWithoutFeedback pointerEvents='box-only' onLayout={(e) => {
            this.props.sideslipView && this.props.sideslipView().onTarget(e.target);
        }}  onPress={() => {
            this.view.snapTo({index: 0})
            if (v.type == 'delete') {
                this.props.sideslipView && this.props.sideslipView().onDelete(this.view);
            }
            v.onPress && v.onPress(this.view)
        }}>
        <View pointerEvents='box-only' onLayout={(e) => {
            console.log(e.target);
            this.props.sideslipView && this.props.sideslipView().onTarget(e.target);
        }} style={{flex:1, width: 80, alignItems: 'center', justifyContent: 'center'}}>
        <Text
            style={[{color: '#fff', fontSize: 14}, v.textStyle]}>{v.title}</Text></View>
        </TouchableWithoutFeedback>


        </Animated.View>
        ))}
    </View>

        <Interactable.View
        ref={(r) => this.view = r}
        horizontalOnly={true}
        boundaries={{right: 0}}
        snapPoints={[
                {x: 0},
        {x: -80 * this.props.menus.length},
    ]}
        onSnap={(v) => {
            this.index = v.nativeEvent.index;
        }}
        onStop={(d) => {
            if (d.nativeEvent.x == 0) {
                this.props.sideslipView && this.props.sideslipView().onStop(this.view, false);
            } else {
                this.props.sideslipView && this.props.sideslipView().onStop(this.view, true);
            }
        }}

        onDrag={(d) => {

            this.props.sideslipView && this.props.sideslipView().onStop(this.view, true);
        }}
        animatedValueX={this._deltaX}>
    <View style={{left: 0, right: 0}}>
        {this.props.children}
    </View>
        </Interactable.View>

        </View>
    );
    }

}


SlideslipRow.propTypes = {

    menus: PropTypes.array,
    sideslipView: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({

    trashHolder: {
        position: 'absolute',
        top: 0,
        height: '100%',
        justifyContent: 'center',
    }
});