<template>
  <div>
      <dl v-for="(item, key) in list.result" :key="key" class="content" v-bind:class="{hl: highKeys[key]}">
        <dt> {{key}} : </dt> 
        <dd>
          <span 
            class="item"
              v-for="(value, index) in item"
              :key="index"
              @click="handleActive(key, value)"
              v-bind:class="{active: value.active, disabled: !value.active && value.disabled}"
            >
            <i class="item-jiao"></i>
            {{ value.name }}
          </span>
        </dd>
      </dl>
      <!-- 已经选择：{{ message }} -->
  </div>
</template>

<script>
export default {
  name: 'ProductMoney',
  props: ['vGoods'],
  data () {
    return {
      data: [],
      // [
      //      { "颜色": "红", "尺码": "大", "型号": "A", "skuId": "3158055" },
      //      { "颜色": "白", "尺码": "大", "型号": "A", "skuId": "3158054" },
      //      { "颜色": "白", "尺码": "中", "型号": "B", "skuId": "3133859" },
      //      { "颜色": "蓝", "尺码": "小", "型号": "C", "skuId": "3516833" }
      //   ],
      skuId: "3158055", // 选中商品ID
      skuName: "skuId",
      // 属性名称信息
      keys: [],
      // 数据集合{list.result list.items}
      list: {},
      // 分隔符
      spliter: '\u2299',
      result: {},
      message: "",
      highKeys: {},

    }
  },
  created () {
    this.getTextareaData();
  },
  methods: {
    powerset(arr) {
      let ps = [[]];
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0, len = ps.length; j < len; j++) {
          ps.push(ps[j].concat(arr[i]));
        }
      }
      return ps;
    },
    /**
     * 初始化数据
     */
    initData() {
      this.result = {};
      this.keys = this.getAllKeys();
      for (let i = 0; i < this.keys.length; i ++) {
          this.highKeys[this.keys[i]] = false;
      }
      this.list = this.combineAttr(this.data, this.keys);
      this.initSeleted(this.skuId);
      this.buildResult(this.list.items)
      this.updateStatus(this.getSelectedItem());
      this.showResult();
    },
    /**
     * 获取输入表单中的数据进行初始化
     */
    getTextareaData() {
      // 数据处理
      let vm = this;
      let list = [];
      vm.vGoods.forEach((e, i) => {
        let obj = {}
        let arr1 = e.specification.split(',');
        arr1.forEach((p, j) => {
          let arr2 = p.split(':');
          obj[arr2[0]] = arr2[1]
        })
        obj.skuId = e.id;
        list.push(obj)
        if(e.isDefault == 1){
          vm.skuId = e.id;
        }
      })
      vm.data = list;
      // 初始化
      this.initData();
    },
    /**
     * 正常属性点击
     */
    handleNormalClick(key, value) {
      for (let i in this.list.result[key]) {
        if (i != value.name) {
          this.list.result[key][i].active = false;
        } else {
          this.list.result[key][i].active = true;
        }
      }
    },
    /**
     * 无效属性点击
     */
    handleDisableClick(key, value) {
      this.list.result[key][value.name]["disabled"] = false;
      // 清空高亮行的已选属性状态（因为更新的时候默认会跳过已选状态）
      for (let i in this.list.result) {
        if (i != key) {
          for (let x in this.list.result[i]) {
            this.list.result[i][x].active = false;
          }
        }
      }
      this.updateStatus(this.getSelectedItem());
    },
    /**
     * 高亮行
     */
    highAttributes: function() {
      for (let key in this.list.result) {
        this.highKeys[key] = true;
        for (let attr in this.list.result[key]) {
          if (this.list.result[key][attr].active === true) {
            this.highKeys[key] = false;
            break;
          }
        }
      }
    },
    /**
     * 点击事件处理
     * @param  key   点击的行
     * @param  value 点击的按钮的数据
     */
    handleActive: function(key, value) {
      if (value.active == true) {
          return false;
      }

      this.handleNormalClick(key, value);
      if (value.disabled === true) {
          this.handleDisableClick(key, value);
      }

      this.updateStatus(this.getSelectedItem());
      this.highAttributes();
      this.showResult();
    },
            /**
             * 计算属性
             * @param  {[type]} data [description]
             * @param  {[type]} keys [description]
             * @return {[type]}      [description]
             */
            combineAttr(data, keys) {
                let allKeys = []
                let result = {}

                for (let i = 0; i < data.length; i++) {
                    let item = data[i]
                    let values = []

                    for (let j = 0; j < keys.length; j++) {
                        let key = keys[j]
                        if (!result[key]) {
                            result[key] = {};
                        }

                        if (!result[key][item[key]]) {
                            result[key][item[key]] = {"name": item[key], "active": false, "disabled": true};
                        }

                        values.push(item[key]);
                    }

                    allKeys.push({
                        path: values.join(this.spliter),
                        sku: item['skuId']
                    });
                }

                return {
                    result: result,
                    items: allKeys
                }
            },

            /**
             * 获取所有属性
             * @return {[type]} [description]
             */
            getAllKeys() {
                let arrKeys = [];
                for (let attribute in this.data[0]) {
                    if (!this.data[0].hasOwnProperty(attribute)) {
                        continue;
                    } 

                    if (attribute !== this.skuName) {
                        arrKeys.push(attribute);
                    }
                }

                return arrKeys;
            },

            getAttruites(arr) {
                let result = []
                for (let i = 0; i < arr.length; i++) { 
                    result.push(arr[i].path) 
                }

                return result
            },

            /**
             * 生成所有子集是否可选、库存状态 map
             */
            buildResult(items) {
                let allKeys = this.getAttruites(items)

                for (let i = 0; i < allKeys.length; i++) {
                    let curr = allKeys[i];
                    let sku = items[i].sku;
                    let values = curr.split(this.spliter);
                    let allSets = this.powerset(values);

                    // 每个组合的子集
                    for (let j = 0; j < allSets.length; j++) {
                        let set = allSets[j]
                        let key = set.join(this.spliter)

                        if (this.result[key]) {
                            this.result[key].skus.push(sku)
                        } else {
                            this.result[key] = {
                                skus: [sku]
                            }
                        }
                    }
                }
            },

            /**
             * 获取选中的信息
             * @return Array 
             */
            getSelectedItem() {
                let result = [];
                for (let attr in this.list.result) {
                    let attributeName = '';
                    for (let attribute in this.list.result[attr]) {
                        if (this.list.result[attr][attribute].active === true) {
                            attributeName = attribute;
                        }
                    }

                    result.push(attributeName);
                }

                return result
            },

            /**
             * 更新所有属性状态
             */
            updateStatus(selected) {
                for (let i = 0; i < this.keys.length; i++) {
                    let key = this.keys[i],
                        data = this.list.result[key],
                        hasActive = !!selected[i],
                        copy = selected.slice();

                    for (let j in data) {
                        let item = data[j]["name"];
                        if (selected[i] == item) {
                            continue
                        }

                        copy[i] = item
                        let curr = this.trimSpliter(copy.join(this.spliter), this.spliter);
                        this.list.result[key][j]["disabled"]  = this.result[curr] ? false : true;
                    }
                }
            },

            trimSpliter(str, spliter) {
                // ⊙abc⊙ => abc
                // ⊙a⊙⊙b⊙c⊙ => a⊙b⊙c
                let reLeft    = new RegExp('^' + spliter + '+', 'g');
                let reRight   = new RegExp(spliter + '+$', 'g');
                let reSpliter = new RegExp(spliter + '+', 'g');
                return str.replace(reLeft, '')
                    .replace(reRight, '')
                    .replace(reSpliter, spliter)
            },

            /**
             * 初始化选中
             * @param  mixed|Int|String skuId 需要选中的skuId
             * @return {[type]}       [description]
             */
            initSeleted(skuId) {
                for (let i in this.data) {
                    if (this.data[i][this.skuName] == skuId) {
                        for (let x in this.data[i]) {
                            if (x !== this.skuName) {
                                this.list.result[x][this.data[i][x]].active = true;
                            }
                        }
                        break;
                    }
                }
            },

            /**
             * 显示选中的信息
             * @return 
             */
            showResult() {
                let result = this.getSelectedItem()
                let s = []
                for (let i = 0; i < result.length; i++) {
                    let item = result[i];
                    if (!!item) {
                        s.push(item)
                    }
                }

                if (s.length == this.keys.length) {
                    let curr = this.result[s.join(this.spliter)]
                    if (curr) {
                      // s = s.concat(curr.skus)
                      this.skuId = curr.skus[0];
                    }
                    this.message = s.join('-');
                    this.$emit('checkGoods', {
                      id: this.skuId,
                      message: this.message
                    });
                }
            }
  }
}
</script>

<style scoped>
dt {
  font-size: 24px;
  line-height: 56px;
  color: #374048;
}
dl {
  clear: both;
  overflow:hidden;
}
dl.hl dt{
  color: #ff5162;
}
dt, dd {
    /* float:left; */
    line-height: 40px;
    /* margin-left: 10px; */
}
.item {
  display: inline-block;
  line-height: 38px;
  padding: 11px 26px;
  border-radius: 4px;
  border: 1px solid #d3d3d3;
  margin-bottom: 18px;
  margin-right: 18px;
  position: relative;
}
.item-jiao{
  position: absolute;
  height: 0;
  width: 0;
  border: 14px solid transparent;
  border-top-color: #fff;
  border-right-color: #fff;
  border-radius: 4px;
  top: 0;
  right: 0;
}
.disabled {
    color:#999;
    border: 1px dashed #666;
}
.active {
  color: #fff;
  background: -webkit-linear-gradient(left, #FFA34A , #FF8205); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(right, #FFA34A , #FF8205); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(right, #FFA34A , #FF8205); /* Firefox 3.6 - 15 */
  background: linear-gradient(to right, #FFA34A , #FF8205); /* 标准的语法（必须放在最后） */
  /* border: 1px solid #ff5162; */
}
</style>
