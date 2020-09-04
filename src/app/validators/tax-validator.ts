import { FormControl, ControlContainer } from '@angular/forms';

export class TaxValidator {

    private static GLOBAL_BLACKLIST = [
        '00000000',
        '11111111',
        '22222222',
        '33333333',
        '44444444',
        '55555555',
        '66666666',
        '77777777',
        '88888888',
        '99999999',
        '12345678',
        '123123123'
    ];

    private static isValidEin(value: string): boolean {
        const einRegex = /^\d{2}[- ]{0,1}\d{7}$/;
        let prefixes = [];
        const CAMPUS = {
            andover: ['10', '12'],
            atlanta: ['60', '67'],
            austin: ['50', '53'],
            brookhaven: ['01', '02', '03', '04', '05', '06', '11', '13', '14', '16', '21', '22', '23', '25', '34', '51', '52', '54', '55', '56', '57', '58', '59', '65'],
            cincinnati: ['30', '32', '35', '36', '37', '38', '61'],
            fresno: ['15', '24'],
            internet: ['20', '26', '27', '45', '46', '47'],
            kansas: ['40', '44'],
            memphis: ['94', '95'],
            ogden: ['80', '90'],
            philadelphia: ['33', '39', '41', '42', '43', '46', '48', '62', '63', '64', '66', '68', '71', '72', '73', '74', '75', '76', '77', '81', '82', '83', '84', '85', '86', '87', '88', '91', '92', '93', '98', '99'],
            sba: ['31']
        };
        for (const location in CAMPUS) {
            prefixes.push(...CAMPUS[location]);
        }
        if (!einRegex.test(value)) {
            // console.log('bad einregex');
            return false;
        }
        if(value.length == 9 && prefixes.indexOf(value.substr(0,2)) > -1) {
        console.log('good ein: ' + value);
        }
        else console.log('bad ein: ' + value);
        return prefixes.indexOf(value.substr(0, 2)) > -1;
    }

    private static isValidItin(value: string): boolean {
        // const itinRegex = /^(9\d{2})[- ]{0,1}((7[0-9]{1}|8[0-8]{1})|(9[0-2]{1})|(9[4-9]{1}))[- ]{0,1}(\d{4})$/;
        const itinRegex = /^(9\d{2})[- ]{0,1}(5[0-9]{1}|6[0-5]{1}|8[3-8]{1}|9[0-2]{1}|9[4-9]{1})[- ]{0,1}(\d{4})$/;
        if(value.length == 9) {
        console.log('itinregex test: ' + itinRegex.test(value));
        }
        return itinRegex.test(value);
    }

    public static isValidTin(control: FormControl): { [s: string]: boolean } {
        for (let blacklisted of TaxValidator.GLOBAL_BLACKLIST) {
            if (control.value.replace(/\D/g, '').startsWith(blacklisted)) {
                console.log('global blacklist bad');
                return { isValidTin: false }
            }
           //console.log('valid Tin maybe?');
        }

        // all work individually...
        //    return(TaxValidator.isValidItin(control.value))
        // return(TaxValidator.isValidSsn(control.value));
        // return(TaxValidator.isValidEin(control.value));


        // if(TaxValidator.isValidItin(control.value) == null || TaxValidator.isValidEin(control.value) == null) {
        //     return null;
        // } 

        return TaxValidator.isValidItin(control.value) || TaxValidator.isValidEin(control.value) ? null : { validTin: false }
        // if (TaxValidator.isValidItin(control.value) || TaxValidator.isValidEin(control.value) || TaxValidator.isValidSsn(control.value)) return null;
    }


}
// }

