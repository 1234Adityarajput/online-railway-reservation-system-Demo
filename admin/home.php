<h1>Welcome to <?php echo $_settings->info('name') ?> - Admin Panel</h1>
<hr class="border-info">
<div class="row">
    <div class="col-12 col-sm-12 col-md-6 col-lg-3">
        <div class="info-box bg-gradient-light shadow">
            <span class="info-box-icon bg-gradient-warning elevation-1"><i class="fas fa-train"></i></span>

            <div class="info-box-content">
            <span class="info-box-text">Total Trains</span>
            <span class="info-box-number text-right">
                <?php 
                    $train_q = ($conn && $conn instanceof mysqli) ? @$conn->query("SELECT * FROM `train_list` where delete_flag = 0 ") : false;
                    echo ($train_q && $train_q instanceof mysqli_result) ? $train_q->num_rows : 0;
                ?>
            </span>
            </div>
            <!-- /.info-box-content -->
        </div>
        <!-- /.info-box -->
    </div>
    <div class="col-12 col-sm-12 col-md-6 col-lg-3">
        <div class="info-box bg-gradient-light shadow">
            <span class="info-box-icon bg-gradient-info elevation-1"><i class="fas fa-calendar"></i></span>

            <div class="info-box-content">
            <span class="info-box-text">Daily Schedules</span>
            <span class="info-box-number text-right">
                <?php 
                    $sched_q1 = ($conn && $conn instanceof mysqli) ? @$conn->query("SELECT * FROM `schedule_list` where `type` = 1 and delete_flag=0 ") : false;
                    echo ($sched_q1 && $sched_q1 instanceof mysqli_result) ? $sched_q1->num_rows : 0;
                ?>
            </span>
            </div>
            <!-- /.info-box-content -->
        </div>
        <!-- /.info-box -->
    </div>
    <div class="col-12 col-sm-12 col-md-6 col-lg-3">
        <div class="info-box bg-gradient-light shadow">
            <span class="info-box-icon bg-gradient-primary elevation-1"><i class="fas fa-calendar-day"></i></span>

            <div class="info-box-content">
            <span class="info-box-text">One-Time Schedules</span>
            <span class="info-box-number text-right">
                <?php 
                    $sched_q2 = ($conn && $conn instanceof mysqli) ? @$conn->query("SELECT * FROM `schedule_list` where `type` = 2 and delete_flag=0 ") : false;
                    echo ($sched_q2 && $sched_q2 instanceof mysqli_result) ? $sched_q2->num_rows : 0;
                ?>
            </span>
            </div>
            <!-- /.info-box-content -->
        </div>
        <!-- /.info-box -->
    </div>
    <div class="col-12 col-sm-12 col-md-6 col-lg-3">
        <div class="info-box bg-gradient-light shadow">
            <span class="info-box-icon bg-gradient-teal elevation-1"><i class="fas fa-ticket-alt"></i></span>

            <div class="info-box-content">
            <span class="info-box-text">Reserved Passengers</span>
            <span class="info-box-number text-right">
                <?php 
                    $res_q = ($conn && $conn instanceof mysqli) ? @$conn->query("SELECT * FROM `reservation_list` where unix_timestamp(schedule) >= '".(time())."' ") : false;
                    echo ($res_q && $res_q instanceof mysqli_result) ? $res_q->num_rows : 0;
                ?>
            </span>
            </div>
            <!-- /.info-box-content -->
        </div>
        <!-- /.info-box -->
    </div>
</div>
<hr>
