<nut-tab-pane title="施工中" :pane-key="1">
            <PageList :api="getOrdersRes">
              <template #item="{ data }">
                <div class="order-card">
                  <div class="card-header">
                    <div class="car-info">
                      <div class="car-icon">
                        <text>🚗</text>
                      </div>
                      <div class="info">
                        <div class="name-wrap">
                          <span class="name">{{ data.vehicle_type }}</span>
                        </div>
                        <div class="sn flex items-center gap-x-1">
                          <span class="i-mdi-cellphone-android text-[#888]"></span>
                          {{ data.user?.mobile }}
                        </div>
                      </div>
                    </div>
                    <div class="price-wrap">
                      <div class="price">¥ {{ data.hour_price }}</div>
                      <div class="desc">工时费</div>
                    </div>
                  </div>

                  <div class="detail-list">
                    <div class="detail-item">
                      <span class="icon i-mdi-invoice-text-multiple"></span>
                      <span class="label">订单号</span>
                      <span class="value">{{ data.order_sn }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="icon i-mdi-car-wrench"></span>
                      <span class="label">产品</span>
                      <span class="value">{{ data.product_name }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="icon i-mdi-car-wrench"></span>
                      <span class="label">服务项目</span>
                      <span class="value">{{ data.service_name }}</span>
                    </div>
                  </div>

                  <div class="actions">
                    <nut-button
                      block
                      type="primary"
                      size="large"
                      @click="navTo(`/pages/completion/index?id=${data.id}&type=2`)"
                    >
                      完成施工
                    </nut-button>
                  </div>
                </div>
              </template>
            </PageList>
          </nut-tab-pane>

<nut-tab-pane title="已完成" :pane-key="2">
            <!-- 已完成订单简略版 -->
            <div class="order-list">
              <div class="order-card mini">
                <div class="card-header">
                  <div class="car-info">
                    <div class="car-icon">
                      <text>🚗</text>
                    </div>
                    <div class="info">
                      <div class="name-wrap">
                        <span class="name">奥迪 A6L 2023款</span>
                        <!-- <span class="tag pending">待施工</span> -->
                      </div>
                      <div class="sn">订单号：#36123217</div>
                    </div>
                  </div>
                  <div class="price-wrap">
                    <div class="price">¥ 450.00</div>
                    <div class="desc">工时费</div>
                  </div>
                </div>
                <div class="card-footer">
                  <span class="time">完工时间：2026-03-20 10:30</span>
                  <span class="invoice-tag uninvoiced">未开票</span>
                </div>
              </div>
              <div class="order-card mini">
                <div class="card-header">
                  <div class="car-info">
                    <div class="car-icon">
                      <text>🚗</text>
                    </div>
                    <div class="info">
                      <div class="name-wrap">
                        <span class="name">奥迪 A6L 2023款</span>
                        <!-- <span class="tag pending">待施工</span> -->
                      </div>
                      <div class="sn">订单号：#36123217</div>
                    </div>
                  </div>
                  <div class="price-wrap">
                    <div class="price">¥ 450.00</div>
                    <div class="desc">工时费</div>
                  </div>
                </div>
                <div class="card-footer">
                  <span class="time">完工时间：2026-03-18 16:20</span>
                  <span class="invoice-tag invoiced">已开票</span>
                </div>
              </div>
            </div>
            <!-- 去开票入口 -->
            <div class="invoice-entry" @tap="navTo('/pages/invoice/index')">
              <div class="invoice-entry-left">
                <text class="entry-icon">🧾</text>
                <div class="entry-info">
                  <div class="entry-title">待结算资金</div>
                  <div class="entry-sub">本月有 2 单待结算，点击前往处理</div>
                </div>
              </div>
              <text class="entry-arrow">›</text>
            </div>
          </nut-tab-pane>

<nut-tab-pane title="售后处理" :pane-key="3">
            <!-- 售后处理 -->
            <div class="after-sale-card">
              <div class="card-content">
                <div class="header">
                  <span class="title">订单 #36123009 售后申请</span>
                  <span class="tag warning">待处理</span>
                </div>
                <div class="time">申请时间：2023-12-20 09:15</div>
                <div class="desc-box">
                  <text class="label">问题描述：</text>
                  <text class="content">
                    客户反馈洗车后发现左前门把手处有细微划痕，请核实施工前照片。
                  </text>
                </div>
                <div class="actions">
                  <span class="btn-text">驳回</span>
                  <nut-button type="warning"> 处理售后 </nut-button>
                </div>
              </div>
            </div>
          </nut-tab-pane>
