/**
 * Created by PedroGaspar on 29/09/2016.
 */

/*
Object.defineProperty(String.prototype, 'format', {
    value: () => {
        var args = arguments;
        console.log (this, args);
        return this.replace(/@@(\d+)/g, function(match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    }
});
*/


export function sprintf (format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/@@(\d+)/g, function(match, number) {
        return typeof args[number] != 'undefined'
            ? args[number]
            : match
            ;
    });
}

export default {
    "sprintf": sprintf
}