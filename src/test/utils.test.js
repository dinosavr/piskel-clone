import {hexToRgbA, isRgbaVisible} from '../js/utils'

describe('hexToRgbA check', () => {

  it('should return Defined Value', () =>{
    expect(hexToRgbA('#f58907')).toBeDefined();      
  })
  it('should return color rgba format', () =>{
    expect(hexToRgbA('#f58907')).toBe('rgba(245,137,7,1.000)');      
  })  

});

describe('isRgbaVisible check', () => {

  it('should return Defined Value', () =>{
    expect(isRgbaVisible('#f58907')).toBeDefined();      
  })
  it('should return True', () =>{
    expect(isRgbaVisible('rgba(245,137,7,1.000)')).toBeTruthy();
  })  

});