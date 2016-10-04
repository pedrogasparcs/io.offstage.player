/**
 * Created by PedroGaspar on 04/10/2016.
 */

import React, {Component} from 'react';

class MediaBox extends Component {
    handleOver (itemId) {
        if(document.getElementById("video" + itemId))
            document.getElementById("video" + itemId).play();
    }

    handleOut (itemId) {
        if(document.getElementById("video" + itemId))
            document.getElementById("video" + itemId).pause();
    }

    handleClick (itemId) {
        if(document.getElementById("video" + itemId))
            document.getElementById("video" + itemId).pause();
    }

    handleImageLoaded (e) {
        document.getElementById("media" + this.props.media._id).className += " loaded";
    }

    handleImageError (e) {
        this.props.onError (this.props.media._id);
    }

    render () {
        var itemId = "media" + this.props.media._id;
        // style={{'minHeight':'200px', 'background':'url("' + this.props.media.content.images.standard_resolution.url + '") no-repeat center center', 'backgroundSize': 'cover'}}
        var likes = <div className="codfeesh-media-likes" style={{zIndex:3}}><span>{this.props.media.likes}</span></div>
        if (this.props.loadstyling) {
            likes = <div className="codfeesh-media-likes" style={{zIndex:3}}><i className="material-icons">favorite</i> <span>{this.props.media.likes}</span></div>
        }
        var video = "";
        if(this.props.media.type=="video") {
            video = <video id={"video" + itemId} poster={this.props.media.content.images.standard_resolution.url} width="100%" height="100%" style={{position:'absolute', zIndex:2, top:0, left:0}}><source src={this.props.media.content.videos.standard_resolution.url} type="video/mp4" /></video>
        }
        return (
            <div className="codfeesh-media" id={itemId}>
                <a href={this.props.media.link} target="_blank" onClick={this.handleClick.bind(this, itemId)} onMouseOver={this.handleOver.bind(this, itemId)} onMouseOut={this.handleOut.bind(this, itemId)}>
                    <div className="codfeesh-media-image-area" data-src={this.props.media.content.images.standard_resolution.url}>
                        <img src={this.props.media.content.images.standard_resolution.url} width="100%" style={{position:'relative', zIndex:1}}
                             onLoad={this.handleImageLoaded}
                             onError={this.handleImageError}/>
                        {video}
                        {likes}
                    </div>
                </a>
            </div>
        );
    }
}

export default MediaBox;