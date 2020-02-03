import * as d3 from 'd3'
import { feature } from 'topojson-client'

export default class BufferGlobe {
    getPath = (pathType, scalePercent = 0, rotation) => {
        let canvasHolder = document.querySelector(".canvas")
        let translateArr = [0, 0]
        let scale = 300 * (scalePercent/100 + 1)

        if(canvasHolder){
            let sizer = canvasHolder.getBoundingClientRect()
            translateArr = [sizer.width/2 , sizer.height/2]
        }

        let projection
        if(pathType == "orthographic"){
            projection = d3.geoOrthographic()
                .translate(translateArr)
                .scale(scale)
                .rotate(rotation)
        } else if(pathType == "mercator"){
            projection = d3.geoMercator()
                .translate(translateArr)
                .scale(scale)
        }

        let path = d3.geoPath()
            .projection(projection)

        return path
    }
    
    genGeography = () => {
        if(mounted){
            let features = feature(topojson, topojson.objects.continent).features
            let path = getPath("orthographic")

            let paths = features.map((feature, i) => {
                return <path key={i+1} d={path(feature.geometry)} style={{fill:"#d0d0d0"}}></path>
            })

            paths.unshift(<path key={0} d={path({type:"Sphere"})} style={{fill:"#fbf5f5", strokeWidth:"0.7px", stroke:"a0a0a0"}}></path>)
            return paths
        }
    }

    genDatapoints = (features) => {
        if(features){
            let path = getPath("orthographic", 1)

            let circles = features.map((feature) => {
                return d3.geoCircle().center([feature.geometry.coordinates[0],feature.geometry.coordinates[1]]).radius(Math.sqrt(Math.pow(3, feature.properties.mag)/Math.PI))()
            })

            return circles.map((circle, i) => {
                return <path key={i} d={path(circle)} style={{fill: linearColor(Number(features[i].properties.mag)), opacity: "0.2"}}></path>
            })
        }
    }
}