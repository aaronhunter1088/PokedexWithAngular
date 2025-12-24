import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: "sort",
    pure: false
})
export class ArraySortPipe implements PipeTransform {
    transform(array: any[], field: string): any[] {
        array.sort((a: any, b: any) => {
            if (a['id'] < b['id']) {
                return -1;
            } else if (a['id'] > b['id']) {
                return 1;
            } else {
                return 0;
            }
        });
        return array;
    }
}
